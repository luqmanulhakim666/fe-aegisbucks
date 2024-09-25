<template>
  <div>
    <template v-if="loading">
      <general-loading />
    </template>
    <template v-if="!loading">
      <div
        v-if="campaign"
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
      </div>
    </template>
  </div>
</template>

<script>
import tracking from "@/mixins/tracking";
export default {
  mixins: [tracking],

  async asyncData({ store, route, error, redirect }) {
    let campaign = null;
    let loading = true;

    try {
      const res = await store.dispatch("campaign/getDetailPublic", {
        brandSlug: route.query?.brand,
        campaignSlug: route.query?.campaign,
        preview: route.query?.__preview,
      });

      campaign = res.data;

      if (!campaign) {
        redirect("/campaign/404");
      }
    } catch (err) {
      console.error("Error fetching campaign data:", err);
      // Show custom error message
      error({ statusCode: 500, message: "Failed to load campaign data." });
    }
    loading = false;

    return { campaign: campaign, loading: loading };
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
    if (this.campaign?.id) {
      this.setLandingPageData();
      this.tracking("View Campaign", {
        data: {
          campaignId: "aa",
        },
      });
    }
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
