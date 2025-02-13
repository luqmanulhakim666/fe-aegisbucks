<template>
  <div class="container">
    <template v-if="!isAuthenticated">
      <v-img
        class="d-flex mx-auto mb-6"
        max-width="200"
        src="/images/empty.svg"
      />

      <h3 class="h3--small text-center mb-6">
        Silahkan login terlebih dahulu untuk claim voucher
      </h3>

      <general-google-login />
    </template>

    <template v-if="isAuthenticated">
      <template v-if="!state.isSuccess">
        <v-img class="mx-auto" max-width="100" :src="getImage(getLogo)" />
        <h4 class="h4--default text-center mb-6">{{ merchant.name }}</h4>

        <div class="dark lighten-4 pa-4 rounded-xl">
          <div class="d-flex rounded-xl pa-3 grey lighten-3 mb-2">
            <v-icon class="mr-2">mdi-account</v-icon>
            <p class="h7--xxsmall">{{ profile.name }}</p>
          </div>
          <div class="d-flex rounded-xl pa-3 grey lighten-3 mb-2">
            <v-icon class="mr-2">mdi-email</v-icon>
            <p class="h7--xxsmall">{{ profile.email }}</p>
          </div>

          <v-form ref="form" v-model="state.isValid">
            <general-form-text-field
              v-model="form.code"
              class="mt-4"
              required
              bold
              :rules="[required]"
              outlined
              label="Kode Voucher"
              :loading="state.isLoadingRedeem"
            />
          </v-form>
        </div>

        <v-btn
          @click="onSubmit()"
          depressed
          block
          class="success text-capitalize h7--xxsmall"
          >Klaim Sekarang</v-btn
        >
      </template>

      <template v-if="state.isSuccess">
        <lotties-success />

        <div class="d-flex flex-column justify-center mt-n10">
          <h3 class="h3--small text-center">
            Selamat voucher berhasil <br />
            ditukarkan
          </h3>

          <h3 class="h3--small text-center mb-6">
            *Syarat dan Ketentuan berlaku
          </h3>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import tracking from "@/mixins/tracking";
import media from "@/mixins/media";
import { state } from "../../../store";
export default {
  mixins: [rules, tracking, media],
  layout: "campaign",
  data: () => ({
    meta: {
      title: "",
    },
    merchant: {},
    form: {
      code: "",
    },
    state: {
      isLoading: false,
      isValid: true,
      isLoadingRedeem: false,
      isSuccess: false,
    },
  }),

  async created() {
    await this.checkGoogleAuth();
    this.getMerchantDetail();
  },

  computed: {
    profile() {
      const data = this.$store.getters["auth/googleProfile"];

      if (data?.email) {
        return data;
      }
    },

    getLogo() {
      return this.merchant?.logo ?? "";
    },
  },

  methods: {
    async getMerchantDetail() {
      this.state.isLoading = true;
      const id = this.$route?.params?.slug;

      const res = await this.$api.merchants.getOne(id);

      if (res.success) {
        this.merchant = res.data;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    async onSubmit() {
      const valid = await this.validate(this.state.isValid);

      if (valid) {
        this.state.isLoadingRedeem = true;

        const payload = {
          code: this.form.code,
          merchantId: this.merchant.id,
        };

        const res = await this.$api.campaigns.redeem(payload);

        if (res.success) {
          this.setSuccessAlert("Selamat!");
          this.state.isSuccess = true;
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }
      }

      this.state.isLoadingRedeem = false;
    },
    goBack() {
      this.$router.push("/admin/merchants");
    },
  },
};
</script>
