<template>
  <v-card
    flat
    class="course__card d-flex flex-column justify-space-between white rounded-xxl pa-4 fill-height pointer elevation-1"
    @click="onDetail()"
  >
    <div>
      <div class="course__card-top">
        <img
          alt="Offer image"
          class="action_card-image full-width rounded-xl"
          :src="getImage(image)"
          @error="onErrorImage"
        />
      </div>

      <!-- Title -->
      <div class="course__card__title">
        <p class="h7--xxsmall dark--text">{{ name }}</p>
      </div>
    </div>

    <!-- Progress -->
    <div class="mt-4">
      <div class="d-flex align-center mr-4">
        <v-icon size="12" color="dark lighten-2">mdi-clock</v-icon>
        <p class="p--small ml-2 dark--text text-lighten-2">
          {{ diffDays }} Days left
        </p>
      </div>

      <v-btn
        v-if="showButton"
        x-small
        block
        depressed
        class="lms_card-btn text-capitalize h7--xxsmall mt-4 secondary"
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
    id: String,
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

      return expDate.diff(today, "day");
    },
  },

  methods: {
    onDetail() {
      this.$router.push(this.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.course__card {
  &-top {
    position: relative;
    &_label {
      position: absolute;
      top: 0;
    }
  }
  &__label {
    position: absolute;
    z-index: 2;
  }

  &__tags {
    height: 43px;
  }

  &__title {
    height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__description {
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__img {
    height: 158px;
    &-finish {
      filter: grayscale(100%);
    }
  }
}

::v-deep .v-rating .v-icon {
  padding: 1px !important;
}

::v-deep .v-card--link:before {
  background: none;
}
</style>
