<template>
  <div class="neat mx-auto">
    <template v-if="state.isLoading">
      <general-loading />
    </template>

    <template v-if="!state.isLoading">
      <div class="container">
        <div class="d-flex my-4">
          <general-logo max_width="60" />
          <v-spacer />

          <v-icon size="32">mdi-share-variant</v-icon>
        </div>

        <v-img
          class="mx-auto border-thin"
          width="200"
          height="200"
          :src="getImage(product.product.image)"
        />

        <div class="d-flex flex-column justify-center align-center">
          <p class="section-title h7--xxsmall mb-6">
            LIMITED OFFER ONLY <b>{{ decimal(product.discount) }}</b>
          </p>
          <p class="text--default">Jumlah Voucer</p>
          <div class="d-flex align-center my-4">
            <v-btn x-small class="success" icon color="white"
              ><v-icon>mdi-minus</v-icon></v-btn
            >
            <p class="h6--xsmall mx-4">{{ decimal(state.qty) }}</p>
            <v-btn x-small class="success" icon color="white"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </div>
        </div>

        <!-- Term and Conditions -->
        <campaign-term-and-conditions
          :termAndConditions="campaign.termCondition"
        />

        <!-- Retail Partners -->
        <campaign-retail-partners :retailPartners="campaign.retails" />

        <p class="text-center h5--small">Isi data dan dapatkan vouchernya</p>

        <!-- FORM SECTION -->
        <v-form v-model="state.isValid" ref="form">
          <campaign-form :fields="product.inputs" />
        </v-form>

        <v-btn
          block
          large
          depressed
          :color="campaign.primaryColor"
          class="text-capitalize mb-10 h6--xsmall"
          @click="onSubmit()"
          >Dapatkan Voucher Sekarang</v-btn
        >
      </div>
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
import pipe from "@/mixins/pipe";
import rules from "@/mixins/rules";
export default {
  mixins: [pipe, media, rules],
  layout: "empty",
  data: () => ({
    campaign: {},
    product: {},
    state: {
      isValid: true,
      isLoading: false,
      qty: 1,
    },
  }),

  created() {
    this.fetch();
  },

  methods: {
    async fetch() {
      this.state.isLoading = true;
      const brandSlug = this.$route.query.brand;
      const campaignSlug = this.$route.params.slug;
      const producId = this.$route.query.id;
      const preview = this.$route.query.__preview;

      const res = await this.$api.campaigns.public.product(
        brandSlug,
        campaignSlug,
        producId,
        { __preview: preview }
      );

      this.campaign = res.data;

      this.product = res.data.campaignProduct;

      this.state.isLoading = false;
    },

    onDetail() {
      this.$router.push("/admin/templates/1");
    },
    async onSubmit() {
      const valid = await this.validate(this.state.isValid);

      if (!valid) return;

      this.$router.push("/campaign/thank-you");
    },
  },
};
</script>

<style lang="scss" scoped>
.neat {
  max-width: 500px;
  width: 100%;
}
</style>
