<template>
  <div class="product container">
    <template v-if="loading">
      <general-loading />
    </template>

    <template v-if="!loading">
      <template v-if="campaign">
        <div class="white pa-6 rounded-xl">
          <v-img
            class="mx-auto border-thin"
            width="200"
            height="200"
            :src="getImage(product.product.image)"
          />

          <div class="d-flex flex-column justify-center align-center">
            <p class="section-title h7--xxsmall mt-2 mb-4">
              {{ product.promoLabel }}
            </p>

            <p class="text--default dark--text text--lighten-1">
              Jumlah Voucher
            </p>
            <div class="d-flex align-center my-4">
              <v-btn
                x-small
                :style="`background:${campaign.primaryColor};color:${campaign.secondaryColor}`"
                icon
                @click="handleQuantity('decrease')"
                ><v-icon color="white">mdi-minus</v-icon></v-btn
              >
              <p class="h6--xsmall mx-4">{{ decimal(state.qty) }}</p>
              <v-btn
                :style="`background:${campaign.primaryColor};color:${campaign.secondaryColor}`"
                x-small
                icon
                @click="handleQuantity('increase')"
                ><v-icon color="white">mdi-plus</v-icon></v-btn
              >
            </div>
          </div>

          <v-form v-model="state.isValid" ref="form">
            <!-- Term and Conditions -->
            <campaign-term-and-conditions
              class="mt-6"
              :termAndConditions="campaign.termCondition"
            />

            <div
              v-for="(item, index) in campaign.additionalInformation"
              :key="index"
            >
              <campaign-term-and-conditions
                class="mt-6"
                :termAndConditions="item.content"
                :label="item.label"
              />
            </div>

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
          <template v-if="isAuthenticated">
            <div
              class="d-flex rounded-xl py-3 justify-center grey lighten-3 mb-2"
            >
              <v-icon class="mr-2">mdi-email</v-icon>
              <p class="h7--xxsmall">{{ profile.email }}</p>
            </div>
            <v-btn
              block
              large
              depressed
              class="text-capitalize h6--xsmall"
              @click="onSubmit()"
              :loading="state.isLoading"
              :disabled="!isAuthenticated"
              :style="`background:${campaign.primaryColor};color:${campaign.secondaryColor}`"
            >
              Dapatkan Voucher Sekarang
            </v-btn>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
import pipe from "@/mixins/pipe";
import rules from "@/mixins/rules";
import tracking from "@/mixins/tracking";
import campaigns from "../../../../api/campaigns";

export default {
  async asyncData({ store, route }) {
    let loading = true;
    let campaign = null;
    let product = null;

    const res = await store.dispatch("campaign/getDetailProductPublic", {
      brandSlug: route.params?.brandSlug,
      campaignSlug: route.params?.campaignSlug,
      productSlug: route.params?.productSlug,
      preview: route.query.__preview,
    });

    if (res.success) {
      campaign = res.data;
      product = res.data.campaignProduct;
    }

    loading = false;

    return {
      campaign: campaign,
      product: product,
      loading: loading,
    };
  },

  mixins: [pipe, media, rules, tracking],
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
      isLoading: false,
      isValid: true,
      qty: 1,
    },
  }),

  async created() {
    if (this.product) {
      this.setUserInputs();
      this.checkGoogleAuth();
    }
  },

  mounted() {
    if (!this.isPreview) {
      this.trackEvent("View Campaign Product Detail", {
        campaignId: this.campaign.id,
        productId: this.product.id,
      });
    }
  },

  methods: {
    setUserInputs() {
      this.form.userInputs = JSON.parse(JSON.stringify(this.product?.inputs));
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

      this.state.isLoading = true;

      const payload = {
        campaignId: this.campaign.id,
        retailId: this.form.retailId,
        productId: this.product?.productId,
        name: this.profile.name,
        email: this.profile.email,
        googleId: this.profile.sub,
        phone: "081" + this.profile.sub,
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

      this.trackEvent("Click Claim Voucher", {
        campaignId: payload.campaignId,
        productId: payload.productId,
        userInputs: payload.userInputs,
        count: payload.count,
      });

      console.log("res voucher", res);

      this.state.isLoading = false;
      this.$router.push(
        `/campaign/${res.data?.campaign?.id}/${res.data?.groupId}/success`
      );
    },
  },
};
</script>
