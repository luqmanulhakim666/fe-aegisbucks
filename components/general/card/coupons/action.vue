<template>
  <v-card
    flat
    class="promo_card d-flex flex-column justify-space-between white rounded-xxl pa-4 fill-height pointer elevation-1"
    @click="onDetail()"
  >
    <div class="promo_card-top">
      <img
        alt="img"
        class="full-width rounded-xl"
        :src="getImage(image)"
        @error="onErrorImage"
      />

      <p class="promo_card-top_title h7--xxsmall dark--text">{{ name }}</p>
    </div>

    <div class="mt-4">
      <div class="d-flex align-center mr-4">
        <v-icon size="12" color="dark lighten-2">mdi-clock</v-icon>
        <p class="p--small ml-2 dark--text text-lighten-2">
          {{ diffDays }}
        </p>
      </div>

      <v-btn
        v-if="showButton"
        x-small
        block
        depressed
        class="text-capitalize h7--xxsmall mt-4 success dark--text lighten-1"
        >Claim</v-btn
      >
    </div>
  </v-card>
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
  },

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
    onDetail() {
      this.$router.push(this.slug);
    },
  },
};
</script>

<style lang="scss" scoped>
.promo_card {
  width: 100%;
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
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
