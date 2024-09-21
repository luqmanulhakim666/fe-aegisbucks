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

      <div></div>

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
          <p class="h6--xsmall label-text">Flight Date</p>
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
          :rules="[required]"
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

      <general-form-text-field
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
      />
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
export default {
  mixins: [rules, utils, pipe],
  props: {
    loading: Boolean,
    form: Object,
    users: Array,
    brands: Array,
  },
  data: () => ({
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
  },

  methods: {
    async onSubmit() {
      const valid = await this.validate(this.state.isValid);

      if (!valid) return;

      this.$emit("set:loading", true);

      const hours = this.form.time.HH || 23;
      const minutes = this.form.time.mm || 59;
      const seconds = this.form.time.ss || 59;

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
        expiredDate: dateInstance.toISOString(),
        enableCaptcha: this.form.enableCaptcha,
        loginGmail: this.form.loginGmail,
        loginWhatsapp: false,
        googleAnalyticScript: this.form.googleAnalyticScript,
        gmailUsername: this.form.gmailUsername,
        gmailPassword: this.form.gmailPassword,
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
    "form.budget"(val) {
      if (val) {
        this.form.budget = this.decimal(val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .hide-input {
  .v-input__slot {
    display: none !important;
  }
  input {
    display: none !important;
  }
}
</style>
