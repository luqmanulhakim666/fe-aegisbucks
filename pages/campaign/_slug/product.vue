<template>
  <div class="claim_voucher">
    <template v-if="loading">
      <general-loading />
    </template>

    <template v-if="!loading">
      <div class="container">
        <v-img
          class="mx-auto border-thin"
          width="200"
          height="200"
          :src="getImage(product.product.image)"
        />

        <div class="d-flex flex-column justify-center align-center">
          <p class="section-title h7--xxsmall">
            LIMITED OFFER ONLY <b>{{ decimal(product.discount) }}</b>
          </p>

          <p class="p--default mb-6">{{ product.product.description }}</p>

          <p class="text--default dark--text text--lighten-1">Jumlah Voucer</p>
          <div class="d-flex align-center my-4">
            <v-btn
              x-small
              class="success"
              icon
              color="white"
              @click="handleQuantity('decrease')"
              ><v-icon>mdi-minus</v-icon></v-btn
            >
            <p class="h6--xsmall mx-4">{{ decimal(state.qty) }}</p>
            <v-btn
              x-small
              class="success"
              icon
              color="white"
              @click="handleQuantity('increase')"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </div>
        </div>

        <v-form v-model="state.isValid" ref="form">
          <!-- Term and Conditions -->
          <campaign-term-and-conditions
            class="mt-6"
            :termAndConditions="campaign.termCondition"
          />

          <!-- Retail Partners -->
          <campaign-retail-partners
            class="mb-4"
            :retailPartners="campaign.retails"
            :form="form"
            @on:select="onSelectRetailPartner"
          />

          <p class="text-center h5--small mb-4">
            Isi data dan dapatkan vouchernya
          </p>

          <!-- FORM SECTION -->
          <campaign-form :fields="form.userInputs" />
        </v-form>

        <!-- Show Google login button if not logged in -->
        <template v-if="!isAuthenticated">
          <general-google-sign-in @loginSuccess="handleGoogleLogin" />
        </template>

        <!-- Submit button only if authenticated -->
        <v-btn
          v-if="isAuthenticated"
          block
          large
          depressed
          :color="campaign.primaryColor"
          class="text-capitalize mb-10 h6--xsmall"
          @click="onSubmit()"
          :disabled="!isAuthenticated"
        >
          Dapatkan Voucher Sekarang
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
import pipe from "@/mixins/pipe";
import rules from "@/mixins/rules";

export default {
  async asyncData({ store, route }) {
    let loading = true;

    const res = await store.dispatch("campaign/getDetailProductPublic", {
      brandSlug: route.query.brand,
      campaignSlug: route.params.slug,
      producId: route.query.id,
      preview: route.query.__preview,
    });

    loading = false;

    return {
      campaign: res.data,
      product: res.data?.campaignProduct,
      loading: loading,
    };
  },

  mixins: [pipe, media, rules],
  layout: "campaign",
  data: () => ({
    form: {
      campaignId: "",
      retailId: "",
      productId: "",
      name: "",
      email: "",
      googleId: "",
      phone: null,
      count: 1,
      userInputs: [],
    },
    state: {
      isValid: true,
      qty: 1,
    },
  }),

  created() {
    this.setUserInputs();
    this.checkGoogleAuth();
    console.log(this.campaign);
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isGoogleAuth"];
    },
  },

  methods: {
    setUserInputs() {
      this.form.userInputs = JSON.parse(JSON.stringify(this.product?.inputs));
    },

    checkGoogleAuth() {
      this.$store.dispatch("auth/loadGoogleAuth");
    },

    handleGoogleLogin(token) {
      this.$store.dispatch("auth/setGoogleToken", token);
    },

    onSelectRetailPartner(id) {
      this.form.retailId = id;
    },

    handleQuantity(key) {
      if (key === "increase" && this.product.limitClaim > this.state.qty) {
        this.state.qty += 1;
      }

      if (key === "decrease" && this.state.qty > 1) {
        this.state.qty -= 1;
      }

      this.form.count = this.state.qty;
    },

    async onSubmit() {
      const valid = await this.validate(this.state.isValid);

      if (!valid) return;

      const profile = this.$store.getters["auth/googleProfile"];

      const payload = {
        campaignId: this.campaign.id,
        retailId: this.form.retailId,
        productId: this.product?.productId,
        name: profile.name,
        email: profile.email,
        googleId: profile.sub,
        phone: "081" + profile.sub,
        count: this.form.count,
        userInputs: this.form.userInputs?.map((x) => {
          return {
            inputId: x.id,
            value:
              x.type === "checkbox"
                ? x.options?.map((y) => {
                    return y?.value;
                  })
                : x.defaultValue,
          };
        }),
      };

      const res = await this.$api.campaigns.claimVoucher(payload);

      this.$router.push("/campaign/thank-you");

      console.log(res);
    },
  },
};
</script>
