<template>
  <VueSlickCarousel v-bind="settings" :arrows="true">
    <div v-for="(item, index) in items" :key="index">
      <img
        @click="onDetail(item.id)"
        alt="Offer image"
        class="action_card-image full-width full-height cover pointer"
        height="350"
        :src="getImage(item)"
      />
      <!-- <general-card-coupons-banner :item="item" /> -->
    </div>
  </VueSlickCarousel>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import media from "@/mixins/media";
export default {
  mixins: [media],
  props: {
    settings: Object,
    items: Array,
  },
  components: {
    VueSlickCarousel,
  },

  methods: {
    onDetail(id) {
      this.$router.push(id);
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
