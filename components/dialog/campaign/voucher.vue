<template>
  <v-dialog v-model="dialog" persistent max-width="700">
    <div class="white rounded-xl">
      <general-card-dialog-header
        name="Product"
        @close="onEmitClose"
        :loading="state.isLoading"
      />
      <v-card class="pa-4">
        <v-form v-model="state.isValid" ref="form">
          <general-form-autocomplete
            v-model="form.retailId"
            :items="partners"
            item-text="name"
            item-value="id"
            label="Partner"
            outlined
            required
            bold
            :rules="[required]"
          />

          <template v-if="!isEdited">
            <general-form-file
              :acceptFile="['.csv', 'xls', '.xlsx']"
              class="mb"
              required
              bold
              label="Voucher File"
              :form="form"
            />
          </template>

          <div class="mb-8 mt-2">
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
                :min="minDate"
                class="mr-2"
                outlined
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

          <general-form-autocomplete
            v-model="form.productId"
            :items="setProduct"
            item-text="name"
            item-value="id"
            label="Product"
            outlined
            required
            bold
            :rules="[required]"
          />

          <general-form-text-field
            required
            v-model="form.limit"
            label="Limit per User"
            outlined
            bold
            :rules="[required]"
            @keypress="onDigits"
          />

          <general-form-rich-editor
            required
            v-model="form.usageInstruction"
            label="Usage Instruction Steps"
            outlined
            bold
            :rules="[required]"
          />
          <general-form-text-field
            hide-details="auto"
            dense
            class="hide-input mt-2 mb-4"
            v-model="form.usageInstruction"
            :rules="[required]"
          />

          <div class="d-flex justify-end mt-8">
            <v-btn
              class="secondary lighten-5 text-capitalize ml-2 h7--xxsmall"
              depressed
              :loading="state.isLoading"
              @click="onSubmit()"
            >
              Submit
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";
import pipe from "@/mixins/pipe";

export default {
  mixins: [rules, utils, pipe],
  props: {
    item: Object,
    dialog: Boolean,
    partners: Array,
    products: Array,
    isEdited: Boolean,
  },

  data: () => ({
    state: {
      isValid: false,
      isLoading: false,
    },
    form: {
      retailId: null,
      productId: {},
      expiredDate: "",
      limit: null,
      usageInstruction: null,
      file: null,
      date: "",
      time: {
        hh: "",
        mm: "",
        ss: "",
      },
    },
  }),

  computed: {
    setProduct() {
      if (this.products?.length > 0) {
        return this.products?.map((x) => {
          return { ...x.product };
        });
      }
    },

    minDate() {
      let date = new Date();
      return this.$dayjs(date).format("YYYY-MM-DD");
    },
  },

  methods: {
    onEmitClose() {
      this.$emit("on:close");
    },

    async onSubmit() {
      const valid = await this.validate(this.state.isValid);
      const campaignId = this.$route.params.slug;

      if (!valid) return;
      this.state.isLoading = true;

      const hours = this.form.time.hh || 23;
      const minutes = this.form.time.mm || 59;
      const seconds = this.form.time.ss || 59;

      const dateInstance = this.$dayjs(this.form.date)
        .hour(hours)
        .minute(minutes)
        .second(seconds);

      const payload = {
        file: this.form.file,
        retailId: this.form.retailId,
        productId: this.form.productId,
        expiredDate: dateInstance.toISOString(),
        limit: this.toInt(this.form.limit),
        usageInstruction: this.form.usageInstruction,
        id: campaignId,
      };

      if (this.isEdited) {
        delete payload["file"];
        delete payload["id"];
      }

      const res = this.isEdited
        ? await this.$api.campaigns.voucher.update(
            campaignId,
            this.form.id,
            payload
          )
        : await this.$api.campaigns.voucher.upload(payload);

      if (res.success) {
        this.setSuccessAlert(
          this.isEdited ? "Voucher has been updated" : "Voucher has been added"
        );
        this.$emit("on:fetch");
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;

      this.onClearForm();
      this.onEmitClose();
    },

    onClearForm() {
      this.form.retailId = null;
      this.form.date = "";
      this.form.time = {
        hh: "",
        mm: "",
        ss: "",
      };
      this.form.productId = {};
      this.form.expiredDate = null;
      this.form.limit = null;
      this.form.usageInstruction = null;
      this.form.file = null;
      this.$refs.form.resetValidation();
    },
  },

  watch: {
    async dialog(val) {
      if (val && this.item?.productId) {
        this.form = JSON.parse(JSON.stringify(this.item));

        this.form.date = this.$dayjs(this.form.expiredDate).format(
          "YYYY-MM-DD"
        );
        this.form.time = {
          HH: this.$dayjs(this.form.expiredDate).format("HH"),
          mm: this.$dayjs(this.form.expiredDate).format("mm"),
          ss: this.$dayjs(this.form.expiredDate).format("ss"),
        };
      }

      if ((await val) && !this.isEdited) {
        this.onClearForm();
        this.$forceUpdate();
      }
    },
    "form.limit"(val) {
      if (val) {
        this.form.limit = this.decimal(val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cropper-bg {
  background-image: none !important;
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
