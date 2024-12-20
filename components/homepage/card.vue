<template>
  <div>
    <div class="d-flex align-center justify-space-between">
      <p class="h5--small dark--text">{{ title }}</p>
      <p class="h7--xxsmall pointer dark--text">Lihat Semua</p>
    </div>

    <template v-if="!items.length">
      <v-img class="d-flex mx-auto" max-width="200" src="/images/empty.svg" />
      <p class="h7--xxsmall dark--text text-center mt-4">
        Tidak ada kupon yang tersedia
      </p>
    </template>

    <template v-if="items.length">
      <VueSlickCarousel
        v-bind="settings"
        :slidesToShow="handleSlideToShow"
        :arrows="!isMobile"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="pa-2 fill-height"
        >
          <general-card-coupons-action
            @click="onDetail(item.id)"
            :id="item.id"
            :showButton="showButton"
            :image="item"
            :name="item.name"
            :expiredDate="item.expiredDate"
          />
        </div>
      </VueSlickCarousel>
    </template>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import screen from "@/mixins/screen";
export default {
  mixins: [screen],

  props: {
    settings: Object,
    items: Array,
    title: String,
    showButton: false,
  },
  components: {
    VueSlickCarousel,
  },
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
    color: #e27106;
    width: 36px;
    height: 13px;
    background: #e27106;
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
    content: "\02C3";
    font-size: 14px;
    font-weight: bold;
    opacity: 1;
    color: #000000d7 !important;
  }

  .slick-prev:before {
    content: "\02C2";
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
