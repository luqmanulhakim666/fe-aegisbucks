<template>
  <div class="products">
    <template v-if="loading">
      <general-loading />
    </template>

    <template v-if="!loading">
      <campaign-slider
        height="250"
        :primaryColor="campaign.primaryColor"
        :items="items.headerSections"
      />

      <!-- Content Section -->
      <v-container class="pa-10">
        <v-row class="white rounded-xl pa-2">
          <v-col cols="12">
            <p class="h6--xsmall dark--text text--lighten-5">
              {{ getTextContentProducts }}
            </p>
          </v-col>
          <!-- Product Cards -->
          <v-col
            cols="6"
            v-for="(item, index) in campaign.campaignProducts"
            :key="index"
          >
            <campaign-product
              :imageUrl="getImage(item.product)"
              :name="item.product.name"
              :price="item.price"
              :discount="item.discount"
              @on:detail="onDetail(item)"
            />
          </v-col>
        </v-row>
      </v-container>
      <!-- Social Media Section -->
      <campaign-social-media :items="items.footerSections" />
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
import tracking from "@/mixins/tracking";
export default {
  async asyncData({ store, route, redirect }) {
    let loading = true;
    let campaign = null;

    const res = await store.dispatch("campaign/getDetailPublic", {
      brandSlug: route.params?.brandSlug,
      campaignSlug: route.params.campaignSlug,
      preview: route.query?.__preview,
    });

    campaign = res.data;

    if (!campaign) {
      redirect("/campaign/404");
    }

    loading = false;

    return { campaign: campaign, loading: loading };
  },
  mixins: [media, tracking],
  layout: "campaign",
  data: () => ({
    items: {
      primaryColor: null,
      secondaryColor: null,
      backgroundImage: {},
      headerSections: [],
      productSections: [],
      footerSections: [],
    },
  }),

  created() {
    this.setLandingPageData();
  },

  mounted() {
    if (!this.isPreview) {
      this.trackEvent("View Campaign Product List", {
        campaignId: this.campaign.id,
      });
    }
  },

  computed: {
    getTextContentProducts() {
      const findText = this.items.headerSections?.find(
        (x) => x.type === "text"
      );

      return findText?.name ?? "Pilih Voucher yang anda inginkan";
    },
  },

  methods: {
    setLandingPageData() {
      const {
        primaryColor,
        secondaryColor,
        backgroundImage,
        headerSection,
        footerSection,
        campaignProducts,
      } = this.campaign;

      this.items.primaryColor = primaryColor;
      this.items.secondaryColor = secondaryColor;
      this.items.backgroundImage = backgroundImage;
      this.items.headerSections = headerSection;
      this.items.productSections = campaignProducts;

      if (footerSection?.length > 0) {
        this.items.footerSections = footerSection?.map((x) => {
          return {
            ...x,
            color: "",
          };
        });

        this.items.footerSections[0].color = "#3f729b";
        this.items.footerSections[1].color = "#bc2a8d";
        this.items.footerSections[2].color = "#FF0000";
        this.items.footerSections[3].color = "#1DA1F2";
        this.items.footerSections[4].color = "#4a4a4a";
      }
    },

    onDetail(val) {
      this.trackEvent("Click Campaign Product", {
        campaignId: this.campaign.id,
        productId: val.product.id,
      });

      if (this.isPreview) {
        window.location.href = `/campaign/${this.campaign.brand.slug}/${this.campaign.slug}/${val.product.slug}?__preview=true`;
        return;
      }

      window.location.href = `/campaign/${this.campaign.brand.slug}/${this.campaign.slug}/${val.product.slug}`;
    },
  },
};
</script>
