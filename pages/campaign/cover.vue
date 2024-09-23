<template>
  <div
    class="neat mx-auto"
    :style="`background: url(${backgroudnUrl}) no-repeat cover;`"
  >
    <template v-if="state.isLoading">
      <general-loading />
    </template>
    <template v-if="!state.isLoading">
      <campaign-navbar :logo="logo" />

      <div class="container">
        <campaign-slider
          height="70vh"
          :items="items.coverSections"
          :primaryColor="items.primaryColor"
        />
        <v-btn
          depressed
          class="h7--xxsmall text-capitalize mt-6"
          block
          :color="items.primaryColor"
          @click="onGetVoucher()"
          >Dapatkan Voucher</v-btn
        >
      </div>

      <campaign-footer />
    </template>
  </div>
</template>

<script>
export default {
  layout: "empty",
  data: () => ({
    campaign: {},
    state: {
      isLoading: false,
    },
    items: {
      primaryColor: null,
      secondaryColor: null,
      backgroundImageId: null,
      coverSections: [],
      headerSections: [],
      productSections: [],
      footerSections: [],
    },
  }),

  created() {
    this.fetch();
  },

  computed: {
    logo() {
      return `${this.$config.API_URL}/file/${this.campaign?.brand?.logoId}/file`;
    },

    backgroudnUrl() {
      return `${this.$config.API_URL}/file/${this.items.backgroundImageId}/file`;
    },
  },

  methods: {
    async fetch() {
      this.state.isLoading = true;

      const res = await this.$store.dispatch("campaign/getDetailPublic", {
        brandSlug: this.$route.query?.brand,
        campaignSlug: this.$route.query?.campaign,
        preview: this.$route.query?.__preview,
      });

      this.campaign = res.data;

      this.setLandingPageData();

      this.state.isLoading = false;
    },

    setLandingPageData() {
      const {
        primaryColor,
        secondaryColor,
        backgroundImageId,
        coverSection,
        headerSection,
        footerSection,
        campaignProducts,
      } = this.campaign;

      this.items.primaryColor = primaryColor;
      this.items.secondaryColor = secondaryColor;
      this.items.backgroundImageId = backgroundImageId;
      this.items.coverSections = coverSection;
      this.items.headerSections = headerSection;
      this.items.productSections = campaignProducts;
      this.items.footerSections = footerSection;
    },

    onGetVoucher() {
      if (!this.campaign.published) {
        this.$router.push(
          `/campaign/${this.campaign.slug}?brand=${this.campaign.brand.slug}&__preview=true`
        );
        return;
      }

      this.$router.push(
        `/campaign/${this.campaign.slug}?brand=${this.campaign.brand.slug}`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.neat {
  max-width: 500px;
  width: 100%;
  z-index: 0;
}
</style>
