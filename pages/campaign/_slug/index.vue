<template>
  <div class="neat mx-auto">
    <template v-if="state.isLoading">
      <general-loading />
    </template>

    <template v-if="!state.isLoading">
      <campaign-navbar :logo="logo" />

      <campaign-slider
        height="250"
        :primaryColor="campaign.primaryColor"
        :items="items.headerSections"
      />

      <!-- Content Section -->
      <v-container fluid class="content">
        <p class="section-title dark--text text--lighten-5 mb-6">
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
      </v-container>
      <!-- Social Media Section -->
      <campaign-social-media :items="items.footerSections" />

      <div class="mx-auto my-10 d-flex text-center align-center justify-center">
        <general-logo max_width="70" />
      </div>
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
export default {
  mixins: [media],
  layout: "empty",
  data: () => ({
    campaign: {},
    state: {
      isLoading: false,
    },
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
    this.fetch();
  },

  computed: {
    logo() {
      return `${this.$config.API_URL}/file/${this.campaign?.brand?.logoId}/file`;
    },
  },

  methods: {
    async fetch() {
      this.state.isLoading = true;

      const res = await this.$store.dispatch("campaign/getDetailPublic", {
        brandSlug: this.$route.query?.brand,
        campaignSlug: this.$route.params.slug,
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
.neat {
  max-width: 500px;
  width: 100%;
  z-index: 0;
}

.hero-slider {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
  object-fit: cover;
}

.content {
  background-color: #fff;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>
