<template>
  <div class="products">
    <template v-if="loading">
      <general-loading />
    </template>

    <template v-if="!loading">
      <template v-if="!isEmptySlider">
        <campaign-slider
          height="250"
          :primaryColor="campaign.primaryColor"
          :items="getImages"
        />
      </template>

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
      <template v-if="hasFooters">
        <campaign-social-media :items="items.footerSections" />
      </template>
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
import tracking from "@/mixins/tracking";
import meta from "@/mixins/meta";
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
  mixins: [media, tracking, meta],
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
      backgroundImage: {},
      headerSections: [],
      productSections: [],
      footerSections: [],
    },
  }),

  created() {
    if (this.campaign?.id) {
      this.setLandingPageData();
      this.meta.title = `Campaign Products ${this.campaign.brand.name} ${this.campaign.name} `;
      if (this.campaign.coverSection?.length > 0) {
        this.meta.image = this.getImage(this.campaign.coverSection[0]);
      }
      this.meta.description = this.campaign.slug;
    }
  },

  mounted() {
    if (!this.isPreview) {
      this.trackEvent("View Campaign Product List", {
        campaignId: this.campaign.id,
      });
    }
  },

  computed: {
    isEmptySlider() {
      return (
        this.campaign?.headerSection === null ||
        this.campaign?.headerSection?.length === 0
      );
    },
    hasFooters() {
      return this.items.footerSections.some(
        (item) => item.value?.trim() !== ""
      );
    },

    getImages() {
      const images = this.items.headerSections?.filter(
        (x) => x.type === "image"
      );

      return images?.length > 0 ? images : false;
    },

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
      const query = this.$route?.query;
      this.trackEvent("Click Campaign Product", {
        campaignId: this.campaign.id,
        productId: val.product.id,
      });

      if (this.isPreview) {
        this.$router.push({
          path: `/campaign/${this.campaign.brand.slug}/${this.campaign.slug}/${val.product.slug}?__preview=true`,
          query: query,
        });
        return;
      }

      this.$router.push({
        path: `/campaign/${this.campaign.brand.slug}/${this.campaign.slug}/${val.product.slug}`,
        query: query,
      });
    },
  },
};
</script>
