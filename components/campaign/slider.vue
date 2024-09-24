<template>
  <div>
    <v-carousel
      v-model="index"
      :height="height"
      hide-delimiters
      :show-arrows="false"
      class="carousel"
      cycle
    >
      <v-carousel-item
        class="grey lighten-3"
        v-for="(item, i) in items"
        :key="i"
      >
        <v-img
          :height="height"
          :src="getImage(item)"
          class="carousel-image cover"
        />
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
import media from "@/mixins/media";
export default {
  mixins: [media],
  props: {
    primaryColor: {
      type: String,
      default: "primary",
    },
    items: Array,
    height: {
      type: [String, Number],
      default: "auto",
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
</style>
