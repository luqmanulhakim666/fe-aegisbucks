<template>
  <div class="container">
    <VueSlickCarousel v-bind="settings.banner" :arrows="false" >
      <div v-for="(item, index) in items.banners" :key="index">
        <general-card-cupons-banner :item="item" />
      </div>
    </VueSlickCarousel>

    <!-- BRANDS -->
    <div class="mt-10">
      <div class="d-flex align-center justify-space-between mb-4">
        <p class="h5--small dark--text">Brand Populer</p>
        <p class="h7--xxsmall pointer success--text">Lihat Semua</p>
      </div>
      <v-row>
        <v-col cols="auto" v-for="(item, index) in items.brands" :key="index">
          <v-img width="100" :src="item"></v-img>
        </v-col>
      </v-row>
    </div>

    <!-- CLAIMS -->
    <div class="mt-10">
      <div class="d-flex align-center justify-space-between">
        <p class="h5--small dark--text">Penawaran Utama</p>
        <p class="h7--xxsmall pointer success--text">Lihat Semua</p>
      </div>
      <VueSlickCarousel v-bind="settings.product"
      :slidesToShow="handleSlideToShow"
      :arrows="!isMobile"
      >
        <div v-for="(item, index) in items.products" :key="index" class="pa-2">
          <general-card-cupons-action
            isCTA
            :image="item.image"
            :title="item.title"
            :expiredDate="item.expiredDate"
          />
        </div>
      </VueSlickCarousel>
    </div>

    <div class="mt-10">
      <div class="d-flex align-center justify-space-between">
        <p class="h5--small dark--text">Penawaran Kupon</p>
        <p class="h7--xxsmall pointer success--text">Lihat Semua</p>
      </div>
      <VueSlickCarousel v-bind="settings.product"
      :slidesToShow="handleSlideToShow"
      :arrows="!isMobile"
      >
        <div v-for="(item, index) in items.products" :key="index" class="pa-2">
          <general-card-cupons-action
            ecommerce
            :image="item.image"
            :title="item.title"
            :expiredDate="item.expiredDate"
          />
        </div>
      </VueSlickCarousel>
    </div>

    <div class="mt-10 mb-10">
      <div class="d-flex align-center justify-space-between mb-3">
        <p class="h5--small dark--text">Reward Saya</p>
        <p class="h7--xxsmall pointer success--text">Lihat Semua</p>
      </div>
      <VueSlickCarousel v-bind="settings.product"
      :slidesToShow="handleSlideToShow"
      :arrows="false"
      >
        <v-row
          v-for="(item, index) in items.products"
          :key="index"
        >
          <v-col dense>
            <img class="full-width" :src="item.image"></img>
          </v-col>
        </v-row>
      </VueSlickCarousel>
    </div>
  </div>
</template>

<script>
import { BANNERS, PRODUCTS, BRANDS } from "@/data/dummy";
import meta from "@/mixins/meta";
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import screen from "@/mixins/screen";
export default {
  mixins: [screen],

  layout: "app",
  middleware: "unauthenticated",
  meta: [meta],
  components: {
    VueSlickCarousel,
  },

  data: () => ({
    items: {
      banners: BANNERS,
      products: PRODUCTS,
      brands: BRANDS,
    },
    settings: {
      banner: {
        dots: true,
        dotsClass: "slick-dots custom-dot-class",
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
      product: {
        focusOnSelect: true,
        infinite: true,
        slidesToScroll: 1,
        speed: 500,
        centerPadding: '20px',
      },
    },
    meta: {
      title: "LetsbuyAsia",
    },
  }),

  computed: {
    handleSlideToShow() {
      if (this.isMobile) return 1;
      if (this.isTablet) return 2;
      if (this.isDesktop) return 3;
      return 3;
    },
  },
};
</script>

<style lang="scss" scoped>


::v-deep {
  .slick-dots {
    z-index: 1;
  }
  .slick-dots li.slick-active button:before {
    opacity: unset;
    color: #E27106;
    width: 36px;
    height: 13px;
    background: #E27106;
    border-radius: 28px;
    margin-top: 2px;
    margin-left: -10px;
  }

  .slick-arrow {
    z-index: 1;
    width: 40px;
    height: 40px;
    // border: 2px solid #000;
    border-radius: 9999px;
    background-color: rgb(241, 241, 241);
  }

  .slick-next:before {
    content: '\02C3';
    font-size: 14px;
    font-weight: bold;
    opacity: 1;
    color: #000000d7 !important;
  }

  .slick-prev:before {
    content: '\02C2';
    font-size: 14px;
    font-weight: bold;
    opacity: 1;
    color: #000000d7 !important;

  }


  .slick-next {
    margin-right: -20px;
  }

  .slick-prev {
    margin-left: -20px;
  }
}
</style>
