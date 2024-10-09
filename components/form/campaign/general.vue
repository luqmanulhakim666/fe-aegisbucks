<template>
  <div>
    <v-form class="white pa-6 rounded-xl" v-model="state.isValid" ref="form">
      <general-form-text-field
        v-model="form.name"
        required
        bold
        label="Campaign Name"
        outlined
        :rules="[required]"
      />

      <general-form-select
        v-model="form.userId"
        dense
        :items="users"
        item-value="id"
        item-text="name"
        required
        bold
        label="User"
        :rules="[required]"
        outlined
      />

      <p v-if="brandRule" class="text--small error--text">
        You cannot change the Brand because You are already added campaign
        product*
      </p>
      <general-form-select
        v-model="form.brandId"
        :items="brands"
        item-value="id"
        item-text="name"
        dense
        required
        bold
        label="Brand"
        :rules="[required]"
        outlined
        :disabled="brandRule"
      />

      <general-form-rich-editor
        v-model="form.termCondition"
        required
        bold
        label="Term & Condition"
        outlined
        :rules="[required]"
      />

      <general-form-text-field
        class="hide-input mb-2"
        hide-details="auto"
        dense
        v-model="form.termCondition"
        :rules="[required]"
      />

      <div class="mb-8 mt-4">
        <p class="h6--xsmall label-text mb-4">Aditional Informations</p>
        <v-btn
          @click="onAddItem()"
          small
          depressed
          class="primary text-capitalize h8--supersmall mb-6"
        >
          <v-icon small class="mr-2">mdi-plus-circle</v-icon>Add</v-btn
        >

        <draggable
          class="dragArea list-group"
          :list="form.additionalInformation"
          group="people"
          :animation="500"
          tag="transition-group"
          handle=".handle"
        >
          <div
            class="list-group-item d-flex align-start"
            v-for="(item, index) in form.additionalInformation"
            :key="index"
            @click="selectedItem(item, index)"
          >
            <v-icon class="mr-2 mt-4 handle" size="24"
              >mdi-drag-horizontal-variant</v-icon
            >
            <v-expansion-panels
              flat
              class="mb-4 border-thin rounded-lg"
              focusable
            >
              <v-expansion-panel>
                <v-expansion-panel-header color="grey lighten-3">
                  <p class="h6--xsmall">
                    {{ item.label }}
                  </p>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <general-form-text-field
                    v-model="item.label"
                    class="mt-6"
                    label="Ttitle"
                    outlined
                  />

                  <general-form-rich-editor
                    class="full-width ml-2 mr-4"
                    v-model="item.content"
                    outlined
                    hide-details="auto"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-btn icon x-small class="ml-2 mt-2" @click="onRemoveItem(index)"
              ><v-icon color="error">mdi-close-circle</v-icon></v-btn
            >
          </div>
        </draggable>
      </div>

      <general-form-text-field
        v-model="form.budget"
        required
        bold
        label="Budget"
        outlined
        :rules="[required]"
        @keypress="onDigits"
      />

      <div class="mb-8">
        <div class="d-flex align-center mb-2">
          <p class="h6--xsmall label-text">Expired Date</p>
          <p class="h6--xsmall text-capitalize label-text ml-1 error--text">
            *
          </p>
        </div>
        <div class="d-flex">
          <general-form-date-picker
            v-model="form.date"
            :dateValue="form.date"
            class="mr-2"
            outlined
            :min="minDate"
            label="Date"
            :rules="[required]"
          />

          <general-form-timepicker
            v-model="form.time"
            label="Time"
            format="HH:mm:ss"
            placeholder="Waktu (WIB)"
            :rules="[required]"
          />
        </div>
      </div>

      <div class="mb-8">
        <div class="d-flex align-center mb-2">
          <p class="h6--xsmall label-text">Authentication Setting</p>
          <p class="h6--xsmall text-capitalize label-text ml-1 error--text">
            *
          </p>
        </div>

        <v-checkbox
          v-model="form.loginGmail"
          dense
          :ripple="false"
          hide-details="auto"
          class="text-capitalize text--default"
          :rules="[required]"
        >
          <template v-slot:label>
            <p class="text--default">Login By Gmail</p>
          </template>
        </v-checkbox>

        <!-- <v-checkbox
          v-model="form.loginWhatsapp"
          :ripple="false"
          dense
          hide-details="auto"
          class="text-capitalize text--default"
          :rules="[required]"
        >
          <template v-slot:label>
            <p class="text--default">Login By Whatsapp</p>
          </template>
        </v-checkbox> -->
      </div>

      <div class="mb-8">
        <p class="h6--xsmall label-text mb-2">Enable Recaptcha</p>

        <v-checkbox
          v-model="form.enableCaptcha"
          dense
          hide-details="auto"
          class="text-capitalize text--default"
        >
          <template v-slot:label>
            <p class="text--default">Google Recaptcha</p>
          </template>
        </v-checkbox>
      </div>

      <general-form-text-area
        v-model="form.googleAnalyticScript"
        bold
        label="Script Google Analytics"
        outlined
      />

      <!-- <general-form-text-field
        v-model="form.gmailUsername"
        bold
        label="Setting Gmail Username"
        outlined
      />
      <general-form-text-field
        v-model="form.gmailPassword"
        type="password"
        bold
        label="Setting Gmail Password"
        outlined
      /> -->
    </v-form>

    <div class="d-flex justify-end mt-8">
      <v-btn
        :loading="loading"
        class="secondary lighten-5 text-capitalize ml-2 h7--xxsmall"
        depressed
        @click="onSubmit()"
      >
        Save
        <v-icon small class="ml-2">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { AUTH_SETTINGS } from "@/data/general";
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";
import pipe from "@/mixins/pipe";
import draggable from "vuedraggable";

export default {
  mixins: [rules, utils, pipe],
  components: {
    draggable,
  },
  props: {
    loading: Boolean,
    form: Object,
    users: Array,
    brands: Array,
  },

  data: () => ({
    selectedItemIndex: 0,
    state: {
      isValid: true,
    },
    items: {
      auth_settings: AUTH_SETTINGS,
    },
  }),

  computed: {
    minDate() {
      let date = new Date();
      return this.$dayjs(date).format("YYYY-MM-DD");
    },

    brandRule() {
      return this.form.campaignProducts?.length > 0;
    },
  },

  methods: {
    selectedItem(index) {
      this.selectedItemIndex = index;
    },
    onAddItem() {
      this.form.additionalInformation.push({ label: "Title", content: "" });
    },
    onRemoveItem(index) {
      this.form.additionalInformation.splice(index, 1);
    },
    async onSubmit() {
      const valid = await this.validate(this.state.isValid);

      if (!valid) return;

      this.$emit("set:loading", true);

      const hours = this.form.time?.HH || 23;
      const minutes = this.form.time?.mm || 59;
      const seconds = this.form.time?.ss || 59;

      const dateInstance = this.$dayjs(this.form.date)
        .hour(hours)
        .minute(minutes)
        .second(seconds);

      const payload = {
        userId: this.form.userId,
        name: this.form.name,
        brandId: this.form.brandId,
        termCondition: this.form.termCondition,
        budget:
          typeof this.form.budget === "string"
            ? this.toInt(this.form.budget)
            : this.form.budget,
        description: this.form.description,
        expiredDate: dateInstance?.toISOString(),
        enableCaptcha: this.form.enableCaptcha,
        loginGmail: this.form.loginGmail,
        loginWhatsapp: false,
        googleAnalyticScript: this.form.googleAnalyticScript,
        gmailUsername: this.form.gmailUsername,
        gmailPassword: this.form.gmailPassword,
        additionalInformation: this.form.additionalInformation,
      };

      if (this.isCreated) {
        const res = await this.$api.campaigns.create(payload);

        if (res.success) {
          this.$router.push({
            path: `/admin/campaigns/${res.data.id}`,
            query: { tab: "products" },
          });

          this.setSuccessAlert("Campaign has been created");
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }
      }

      if (!this.isCreated) {
        const res = await this.$api.campaigns.update(
          this.$route.params.slug,
          payload
        );

        if (res.success) {
          this.$router.replace({
            path: `/admin/campaigns/${this.$route.params.slug}`,
            query: { tab: "products" },
          });
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }
      }

      this.$emit("set:loading", false);
    },
  },
  watch: {
    "form.budget": {
      handler(val) {
        if (val) {
          this.form.budget = this.decimal(val);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #00557c15;
}

.list-group-item {
  cursor: move;
}

::v-deep a {
  color: var(--v-primary-base) !important;
}
::v-deep .hide-input {
  .v-input__slot {
    display: none !important;
  }
  input {
    display: none !important;
  }
}
</style>
