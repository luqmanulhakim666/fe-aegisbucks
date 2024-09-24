<template>
  <div
    class="cover"
    :style="`${
      backgroudnUrl
        ? `  background: url(${backgroudnUrl})
            no-repeat;
          background-size: cover;`
        : ''
    }
        `"
  >
    <template v-if="loading">
      <general-loading />
    </template>
    <template v-if="!loading">
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
    </template>
  </div>
</template>

<script>
import tracking from "@/mixins/tracking";
export default {
  mixins: [tracking],
  async asyncData({ store, route }) {
    let loading = true;

    const res = await store.dispatch("campaign/getDetailPublic", {
      brandSlug: route.query?.brand,
      campaignSlug: route.query?.campaign,
      preview: route.query?.__preview,
    });

    loading = false;

    return { campaign: res.data, loading: loading };
  },
  layout: "campaign",
  data: () => ({
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
    this.setLandingPageData();
    this.tracking("View Campaign", {
      data: {
        campaignId: "aa",
      },
    });
  },

  computed: {
    backgroudnUrl() {
      if (this.campaign?.backgroundImageId) {
        return `${this.$config.API_URL}/file/${this.campaign.backgroundImageId}/file`;
      }

      return false;
    },
  },

  methods: {
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
