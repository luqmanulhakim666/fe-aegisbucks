<template>
  <div class="product container">
    <div class="white pa-6 rounded-xl">
      <v-img
        class="mx-auto border-thin"
        width="200"
        height="200"
        :src="getImage(product.product.image)"
      />

      <div class="d-flex flex-column justify-center align-center">
        <p class="product-promo_label text-center h7--xxsmall mt-2 mb-4">
          {{ product.promoLabel }}
        </p>

        <p class="text--default dark--text text--lighten-1">Jumlah Voucher</p>
        <div class="d-flex align-center my-4">
          <v-btn
            v-if="product.limitClaim > 1"
            x-small
            :style="`background:${campaign.primaryColor};color:${campaign.secondaryColor}`"
            icon
            @click="handleQuantity('decrease')"
            ><v-icon color="white">mdi-minus</v-icon></v-btn
          >
          <p
            :style="`border:1px solid ${campaign.primaryColor}`"
            class="py-2 px-4 rounded-xl h6--xsmall mx-4"
          >
            {{ decimal(state.qty) }}
          </p>
          <v-btn
            v-if="product.limitClaim > 1"
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
        <!-- <campaign-accordion
              class="mt-6"
              :termAndConditions="campaign.termCondition"
            /> -->

        <div
          v-for="(item, index) in campaign.additionalInformation"
          :key="index"
        >
          <campaign-accordion
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

        <template v-if="hasFormInput">
          <p class="text-center h5--small mb-4">
            Isi data dan dapatkan vouchernya
          </p>
          <!-- FORM SECTION -->
          <campaign-form :fields="form.userInputs" />
          <!-- END FORM SECTIOn -->
        </template>
      </v-form>

      <div v-if="campaign.loginGmail">
        <div v-if="!isAuthenticated">
          <general-google-login :form="form" />
        </div>

        <div v-else>
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
            :style="`background:${campaign.primaryColor};color:${campaign.secondaryColor}`"
          >
            Dapatkan Voucher Sekarang
          </v-btn>
        </div>
      </div>

      <v-btn
        v-if="!campaign.loginGmail"
        block
        large
        depressed
        class="text-capitalize h6--xsmall"
        @click="onSubmit()"
        :loading="state.isLoading"
        :style="`background:${campaign.primaryColor};color:${campaign.secondaryColor}`"
      >
        Dapatkan Voucher Sekarang
      </v-btn>
    </div>
  </div>
</template>

<script>
import media from "@/mixins/media";
import pipe from "@/mixins/pipe";
import rules from "@/mixins/rules";
import tracking from "@/mixins/tracking";
import meta from "@/mixins/meta";

export default {
  async asyncData({ store, route }) {
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

    return {
      campaign: campaign,
      product: product,
    };
  },

  mixins: [pipe, media, rules, tracking, meta],
  layout: "campaign",
  data: () => ({
    meta: {
      title: "",
      image: "",
      description: "",
    },
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

  created() {
    if (this.product) {
      this.setUserInputs();
      this.meta.title = `Campaign ${this.campaign.brand.name} ${this.campaign.name} ${this.product.product.slug}`;
      this.meta.image = this.getImage(this.product.product);
      this.meta.description = this.campaign.slug;
      this.form.campaignId = this.campaign.id;
      this.form.productId = this.product.id;
    }
  },

  mounted() {
    const formLocalStorage = JSON.parse(localStorage.getItem("form"));

    if (
      formLocalStorage?.productId === this.form?.productId &&
      formLocalStorage?.campaignId === this.form?.campaignId
    ) {
      this.form = formLocalStorage;
      this.state.qty = formLocalStorage.count;
    }

    this.checkGoogleAuth();

    if (!this.isPreview) {
      this.trackEvent("View Campaign Product Detail", {
        campaignId: this.campaign.id,
        productId: this.product.id,
      });
    }
  },

  computed: {
    hasFormInput() {
      const form = this.form.userInputs;

      return form?.length > 0;
    },
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
          let finalValue = x.defaultValue;

          if (x.type === "checkbox" && x.options?.length === 1) {
            finalValue = x.options?.map((y) => {
              return y?.value[0];
            });
          }

          if (x.type === "checkbox" && x.options?.length > 1) {
            finalValue = x.defaultValue?.map((y) => {
              return y;
            });
          }
          return {
            inputId: x.id,
            value: finalValue,
          };
        }),
      };

      const res = await this.$api.campaigns.claimVoucher(payload);

      if (res.success) {
        this.trackEvent("Click Claim Voucher", {
          campaignId: payload.campaignId,
          productId: payload.productId,
          userInputs: payload.userInputs,
          count: payload.count,
        });

        if (localStorage.getItem("form")) {
          localStorage.removeItem("form");
        }

        this.$router.push(
          `/campaign/${res.data.brand?.slug}/${res.data?.campaign?.id}/${res.data?.groupId}/success`
        );
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.product {
  &-promo_label {
    white-space: pre-line;
  }
}
</style>
