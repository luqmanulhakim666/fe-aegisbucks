<template>
  <div class="content">
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
      <div class="white container--fluid pa-6">
        <p class="h6--xsmall dark--text text--lighten-5 mb-6">
          Pilih Voucher yang anda inginkan
        </p>

        <v-row>
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
      </div>
      <!-- Social Media Section -->
      <campaign-social-media :items="items.footerSections" />
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
export default {
  async asyncData({ store, route }) {
    let loading = true;

    const res = await store.dispatch("campaign/getDetailPublic", {
      brandSlug: route.query?.brand,
      campaignSlug: route.params.slug,
      preview: route.query?.__preview,
    });

    loading = false;

    return { campaign: res.data, loading: loading };
  },
  mixins: [media],
  layout: "campaign",
  data: () => ({
    items: {
      primaryColor: null,
      secondaryColor: null,
      backgroundImage: {},
      coverSections: [],
      headerSections: [],
      productSections: [],
      footerSections: [],
    },
  }),

  created() {
    this.setLandingPageData();
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
    },

    onDetail(val) {
      if (!this.campaign.published) {
        this.$router.push(
          `/campaign/${this.campaign.slug}/product?id=${val.product.id}&brand=${this.campaign.brand.slug}&__preview=true`
        );
        return;
      }

      this.$router.push(
        `/campaign/${this.campaign.slug}/product?id=${val.product.id}&brand=${this.campaign.brand.slug}`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  background: #ffff;
}
</style>
