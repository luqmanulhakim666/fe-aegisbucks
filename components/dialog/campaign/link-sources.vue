<template>
  <v-dialog v-model="dialog" persistent width="800">
    <div class="white rounded-xl">
      <general-card-dialog-header name="Link Sources" @close="onEmitClose" />
      <div class="pa-4">
        <v-data-table
          :headers="headers"
          :items="campaign.campaignUtms"
          hide-default-footer
          no-data-text="No Data"
          class="mt-4 mb-6"
        >
          <template v-slot:[`item.no`]="{ index }">
            <p class="mb-2">
              {{ index + 1 }}
            </p>
          </template>

          <template v-slot:[`item.type`]="{}">
            <general-form-select
              class="mt-3"
              v-model="form.type"
              :items="items.types"
              item-value="key"
              item-text="name"
              bold
              outlined
              dense
            />
          </template>

          <template v-slot:[`item.name`]="{ item }">
            <v-form v-model="state.isValid" ref="form">
              <div class="d-flex align-center">
                <general-form-text-field
                  :readonly="readOnly"
                  class="full-width mt-4"
                  v-model="item.source"
                  outlined
                  bold
                  :rules="[required]"
                />
              </div>
            </v-form>
          </template>

          <template v-slot:[`item.value`]="{ item, index }">
            <v-form v-model="state.isValid" ref="form">
              <div class="d-flex align-center">
                <div class="pa-2 rounded-xl grey lighten-3">
                  <p>{{ generateLink(item) }}</p>
                </div>

                <v-btn
                  @click="copyLink(generateLink(item))"
                  small
                  icon
                  class="text-capitalize mb-6 mt-4 ml-2"
                  :ripple="false"
                >
                  <v-icon small class="info--text">mdi-content-copy</v-icon>
                </v-btn>

                <v-btn
                  v-if="!readOnly"
                  @click="onRemoveItem(index)"
                  small
                  icon
                  class="text-capitalize mb-6 mt-4"
                  :ripple="false"
                >
                  <v-icon small class="error--text">mdi-close-circle</v-icon>
                </v-btn>
              </div>
            </v-form>
          </template>
        </v-data-table>

        <v-btn
          v-if="!readOnly"
          @click="onAddItem()"
          small
          depressed
          class="dark lighten-3 dark--text text--lighten-1 text-capitalize h8--supersmall mb-6"
        >
          <v-icon small class="mr-2">mdi-plus-circle</v-icon>Add</v-btn
        >

        <div v-if="!readOnly" class="d-flex justify-end">
          <v-btn
            @click="onSubmit()"
            small
            depressed
            class="primary lighten-5 text-capitalize h8--supersmall mb-6"
          >
            Save</v-btn
          >
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";

export default {
  mixins: [rules, utils],
  props: {
    campaign: Object,
    dialog: Boolean,
    readOnly: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    state: {
      isValid: false,
      formMode: false,
    },
    form: {
      source: "",
      type: "utm",
      value: "",
    },
    headers: [
      {
        text: "No",
        value: "no",
        width: 5,
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Type",
        value: "type",
        width: 100,
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Name",
        value: "name",
        width: 140,
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Link",
        value: "value",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
    ],
    items: {
      types: [
        {
          name: "UTM",
          key: "utm",
        },
      ],
    },
  }),

  methods: {
    onAddItem() {
      this.campaign.campaignUtms.push(JSON.parse(JSON.stringify(this.form)));
    },

    onRemoveItem(index) {
      this.campaign.campaignUtms?.splice(index, 1);
    },

    onEmitClose() {
      this.$emit("on:close");
      this.onClearForm();
      // this.campaign.campaignUtms = [];
    },

    onClearForm() {
      this.form = {
        source: "",
        type: "utm",
        value: "",
      };
      this.$refs.form?.resetValidation();
    },

    generateLink(val) {
      const host = this.$config.API_URL.replace("/api", "");
      const campaignSlug = encodeURIComponent(this.campaign.slug);
      const brandSlug = encodeURIComponent(this.campaign.brand?.slug);
      const utmSource = encodeURIComponent(val.source);
      let result = "";

      // if (val.type === "utm") {
      result = `${host}/campaign/${brandSlug}/${campaignSlug}?utm_source=${utmSource}`;
      // }

      val.value = result;

      return result;
    },

    async onSubmit() {
      const valid = this.validate(this.state.isValid);

      if (!valid) return;

      this.state.isLoading = true;

      const payload = {
        utms: this.campaign.campaignUtms?.map((x) => {
          return { source: x.source };
        }),
      };

      const res = await this.$api.campaigns.update(this.campaign.id, payload);

      if (res.success) {
        this.setSuccessAlert("Data has been saved");
        this.$emit("on:close");
        this.onClearForm();
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },
  },
};
</script>
