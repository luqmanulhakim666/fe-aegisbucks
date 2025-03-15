<template>
  <div class="promo_card">
    <template v-if="!isBannerOnly">
      <div
        class="d-flex flex-column justify-space-between white rounded-xxl pa-4 fill-height elevation-1"
        v-bind:class="{ pointer: !showButton }"
        @click="onDetail()"
      >
        <div class="promo_card-top">
          <img
            :lazy-src="`${getImage(image)}?auto=format,compress&w=200`"
            alt="img"
            class="full-width rounded-xl"
            :src="getImage(image)"
            @error="onErrorImage"
          />

          <p class="promo_card-top_title h7--xxsmall dark--text elipsis-200">
            {{ name }}
          </p>
        </div>

        <div class="mt-4">
          <div class="d-flex align-center mr-4">
            <v-icon size="12" color="dark lighten-2">mdi-clock</v-icon>
            <p class="p--small ml-2 dark--text text-lighten-2">
              {{ diffDays }}
            </p>
          </div>

          <a
            :href="ctaUrl"
            v-if="showButton"
            target="_blank"
            class="text-capitalize h7--xxsmall mt-4 success dark--text lighten-1 v-btn v-btn--block v-btn--has-bg theme--light v-size--x-small"
          >
            Claim
          </a>
        </div>
      </div>
    </template>

    <template v-if="isBannerOnly">
      <img
        class="promo_card-banner cover fill-height pointer"
        :src="getImage(image)"
        alt="banner"
        @click="onShowImage(image)"
      />

      <v-dialog v-model="showImage" hide-overlay width="auto" persistent>
        <div class="banner-dialog container d-flex justify-center align-center">
          <div class="image-wrapper">
            <v-btn
              icon
              class="image-wrapper_close-btn"
              @click="showImage = false"
              ><v-icon color="" large>mdi-close-circle</v-icon></v-btn
            >
            <img
              class="fill-height image-wrapper_img d-flex mx-auto"
              :src="getImage(selectedImage)"
              alt=""
            />
          </div>
        </div>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
import pipe from "@/mixins/pipe";
export default {
  mixins: [media, pipe],
  props: {
    slug: String,
    image: Object,
    name: String,
    expiredDate: String,
    partners: {
      type: Boolean,
      default: false,
    },
    showButton: {
      type: Boolean,
      default: false,
    },
    isBannerOnly: Boolean,
    ctaUrl: String,
  },

  data: () => ({
    showImage: false,
    selectedImage: {},
  }),

  computed: {
    diffDays() {
      const date = new Date();
      const expDate = this.$dayjs(this.expiredDate);
      const today = this.$dayjs(date).format("YYYY-MM-DDD");

      if (expDate.diff(today, "day") < 0) {
        return "Expired";
      }

      return expDate.diff(today, "day") + " Days left";
    },
  },

  methods: {
    onShowImage(item) {
      this.showImage = !this.showImage;
      this.selectedImage = item;
    },
    onDetail() {
      if (this.showButton) return;
      this.$router.push(this.slug);
    },
  },
};
</script>

<style lang="scss" scoped>
.promo_card {
  max-width: 265px;
  width: 100%;

  &-banner {
    max-width: 195px;
    width: 100%;
    height: auto;
    min-height: 215px;
  }
  &-top {
    position: relative;
    &_label {
      position: absolute;
      top: 0;
    }

    img {
      height: auto;
      max-height: 140px;
      object-fit: contain;
    }

    &_title {
      height: 50px;
    }
  }
}

.banner-dialog {
  height: 100vh;
}

.image-wrapper {
  position: relative;
  &_img {
    max-width: 90%; /* Adjust as needed */
    max-height: 90vh;
    overflow: hidden;
    height: auto;
    display: block;
  }

  &_close-btn {
    position: absolute;
    right: 0;
    top: -25px;
  }
}

::v-deep {
  .v-dialog:not(.v-dialog--fullscreen) {
    overflow: hidden !important;
  }

  .v-dialog {
    box-shadow: none !important;
  }
}
</style>
