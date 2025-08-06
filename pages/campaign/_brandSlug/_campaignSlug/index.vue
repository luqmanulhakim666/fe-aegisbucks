<template>
  <div class="container">
    <div v-if="campaign">
      <template v-if="!isEmptySlider">
        <campaign-slider
          height="65vh"
          :items="items.coverSections"
          :primaryColor="items.primaryColor"
        />
      </template>
      <v-btn
        depressed
        class="h7--xxsmall text-capitalize mt-6"
        :style="`color: ${items.secondaryColor} !important`"
        block
        large
        :color="items.primaryColor"
        @click="onGetVoucher()"
        >Dapatkan Voucher</v-btn
      >
    </div>
  </div>
</template>

<script>
import tracking from "@/mixins/tracking";
import meta from "@/mixins/meta";
import media from "@/mixins/media";
export default {
  mixins: [tracking, meta, media],

  async asyncData({ store, route, error, redirect }) {
    let campaign = null;

    try {
      const res = await store.dispatch("campaign/getDetailPublic", {
        brandSlug: route.params?.brandSlug,
        campaignSlug: route.params?.campaignSlug,
        preview: route.query?.__preview,
      });

      campaign = res.data;

      if (!campaign) {
        redirect("/campaign/404");
      }
    } catch (err) {
      console.error("Error fetching campaign data:", err);
      error({ statusCode: 500, message: "Failed to load campaign data." });
    }

    return { campaign: campaign };
  },
  layout: "campaign",

  data: () => ({
    meta: {
      title: "",
      image: "",
      description: "",
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
    if (this.campaign?.id) {
      this.setLandingPageData();
      this.checkGoogleAuth();
      this.meta.title = `Campaign ${this.campaign.brand.name} ${this.campaign.name} `;
      if (this.campaign.coverSection?.length > 0) {
        this.meta.image = this.getImage(this.campaign.coverSection[0]);
      }
      this.meta.description = this.campaign.slug;
    }
  },

  computed: {
    isEmptySlider() {
      return (
        this.campaign?.coverSection === null ||
        this.campaign?.coverSection?.length === 0
      );
    },
  },

  mounted() {
    if (!this.isPreview) {
      this.trackEvent("View Campaign", { campaignId: this.campaign.id });
    }
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
      const query = this.$route?.query;

      let url = this.isPreview
        ? `/campaign/${this.campaign.brand.slug}/${this.campaign.slug}/products?__preview=true`
        : `/campaign/${this.campaign.brand.slug}/${this.campaign.slug}/products`;
      const hasOnlyOneProduct = this.campaign?.campaignProducts?.length === 1;

      if (hasOnlyOneProduct) {
        const product = this.campaign.campaignProducts[0].product;

        const productDetailUrl = this.isPreview
          ? `/campaign/${this.campaign.brand.slug}/${this.campaign.slug}/${product.slug}?__preview=true`
          : `/campaign/${this.campaign.brand.slug}/${this.campaign.slug}/${product.slug}`;
        this.trackEvent("Click Campaign Product", {
          campaignId: this.campaign.id,
          productId: product.id,
        });

        return this.$router.push({ path: productDetailUrl, query: query });
      }

      this.$router.push({ path: url, query: query });
    },
  },
};
</script>
