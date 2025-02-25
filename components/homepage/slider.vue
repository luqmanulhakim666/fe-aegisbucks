<template>
  <div>
    <div class="d-flex align-center justify-space-between">
      <p class="h5--small success--text">{{ title }}</p>
      <!-- <p @click="onSeeMore()" class="h7--xxsmall pointer dark--text">
        Lihat Semua
      </p> -->
    </div>

    <template v-if="!items.length">
      <v-img class="d-flex mx-auto" max-width="200" src="/images/empty.svg" />
      <p class="h7--xxsmall dark--text text-center mt-4">
        Tidak ada kupon yang tersedia
      </p>
    </template>

    <template v-if="items.length">
      <v-sheet class="mx-auto slider">
        <v-slide-group
          v-model="slide"
          show-arrows
          class="py-2 transparent"
          ref="slideGroup"
        >
          <v-slide-item v-for="(item, index) in items" :key="index">
            <general-card-coupons-action
              class="mx-2"
              :slug="item.slug"
              :showButton="showButton"
              :image="item"
              :name="item.name"
              :isBannerOnly="isBannerOnly"
              :expiredDate="item.expiredDate"
              :ctaUrl="item.ctaUrl"
            />
          </v-slide-item>

          <!-- Prev Button -->
          <template #prev>
            <v-btn
              v-if="slide > 0"
              @click.prevent.stop="slide = slide - 1"
              fab
              small
              depressed
              class="lighten-1 success"
            >
              <v-icon color="dark">mdi-chevron-left</v-icon>
            </v-btn>
          </template>

          <!-- Next Button -->
          <template #next>
            <v-btn
              v-if="slide < maxSlide"
              class="lighten-1 success"
              fab
              small
              depressed
              @click="slide = slide + 1"
            >
              <v-icon color="dark">mdi-chevron-right</v-icon>
            </v-btn>
          </template>
        </v-slide-group>
      </v-sheet>
    </template>
  </div>
</template>

<script>
import screen from "@/mixins/screen";

export default {
  mixins: [screen],

  props: {
    settings: Object,
    items: Array,
    title: String,
    isBannerOnly: {
      type: Boolean,
      default: false,
    },
    showButton: false,
    isCoupon: {
      type: Boolean,
      default: null,
    },
  },

  data: () => ({
    slide: 0,
  }),

  computed: {
    slidesToShow() {
      if (this.isMobile) return 1;
      if (this.isTablet) return 2;
      if (this.isDesktop) return 3;
      return 3;
    },

    maxSlide() {
      return Math.max(0, this.items.length - this.slidesToShow);
    },
  },

  methods: {
    onSeeMore() {
      this.$router.push(
        this.isCoupon ? "/search?hasCoupon=true" : "/search?hasCoupon=false"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.slider {
  position: relative;
}

.slider:hover ::v-deep .v-slide-group__next {
  opacity: 1;
  transform: translateY(-50%);
}

.slider:hover ::v-deep .v-slide-group__prev {
  opacity: 1;
  transform: translateY(-50%);
}

::v-deep {
  .v-slide-group__next {
    position: absolute;
    top: 40%;
    transform: translateY(-100%);
    opacity: 0;
    transition: opacity 0.3s ease-in-out, transform 0.4s ease-in-out;
    z-index: 1;
    align-items: center;
    display: flex;
    flex: 0 1 52px;
    justify-content: center;
    min-width: 52px;
    right: 0;
  }

  .v-slide-group__wrapper {
    padding: 2px 0;
  }

  .v-slide-group__prev {
    position: absolute;
    top: 40%;
    transform: translateY(-100%);
    left: 0;
    opacity: 0;
    transition: opacity 0.3s ease-in-out, transform 0.4s ease-in-out;
    z-index: 1;
    align-items: center;
    display: flex;
    flex: 0 1 52px;
    justify-content: center;
    min-width: 52px;
  }
}
</style>
