<template>
  <div>
    <v-carousel
      v-model="index"
      :height="height"
      hide-delimiters
      :show-arrows="showArrow && showSliderDots"
      class="carousel"
      show-arrows-on-hover
      :cycle="cycle"
    >
      <v-carousel-item v-for="(item, i) in items" :key="i">
        <template v-if="isImage">
          <v-img
            :lazy-src="`${getImage(item)}?auto=format,compress&w=1946`"
            :height="height"
            contain
            :src="getImage(item)"
            class="carousel-image"
          />
        </template>

        <template v-if="!isImage">
          <div class="full-width text-center">
            <v-divider class="my-6" />
            <h4 class="success--text h4--default">
              {{ item.voucherCode.code }}
            </h4>
            <VueBarcode
              class="d-flex mx-auto justify-center"
              :value="item.voucherCode.code"
            >
              No Data
            </VueBarcode>
            <v-divider class="pb-6" />
          </div>
        </template>
      </v-carousel-item>
    </v-carousel>

    <div class="d-flex justify-center mt-2" v-if="showSliderDots">
      <div v-for="i in totalItems" :key="i">
        <v-avatar
          @click="setIndex(i - 1)"
          size="8"
          class="mx-2 pointer"
          :color="i - 1 === index ? primaryColor : 'grey lighten-2'"
        ></v-avatar>
      </div>
    </div>
  </div>
</template>

<script>
import VueBarcode from "vue-barcode";

import media from "@/mixins/media";
import pipe from "@/mixins/pipe";
export default {
  mixins: [media, pipe],
  components: {
    VueBarcode,
  },
  props: {
    isImage: {
      type: Boolean,
      default: true,
    },
    primaryColor: {
      type: String,
      default: "primary",
    },
    items: Array,
    height: {
      type: [String, Number],
      default: "auto",
    },
    showArrow: {
      type: Boolean,
      default: false,
    },
    cycle: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    totalItems() {
      return this.items?.length;
    },

    showSliderDots() {
      return this.totalItems > 1;
    },
  },

  data: () => ({
    index: 0,
    settings: {
      infinite: false,
      slidesToShow: 1,
      speed: 500,
      rows: 1,
      slidesPerRow: 1,
      dots: true,
    },
  }),

  methods: {
    setIndex(i) {
      this.index = i;
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  // height: calc(65vh - 45px) !important;
}
.carousel-image {
  width: 100%;
  height: auto;
  object-fit: cover; /* Ensures image scales and covers the area without distortion */
}
::v-deep text {
  display: none;
}
</style>
