<template>
  <div class="action_card elevation-1 pa-2 rounded-xl">
    <img
      alt="Offer image"
      class="action_card-image full-width rounded-xl"
      :src="getImage(image)"
      @error="onErrorImage"
    />

    <p class="h7--xxsmall">
      {{ name }}
    </p>

    <div class="d-flex align-center mt-6 mb-4">
      <div class="d-flex align-center mr-4">
        <v-icon size="12" color="dark lighten-2">mdi-clock</v-icon>
        <p class="p--small ml-2 dark--text text-lighten-2">
          {{ diffDays }} Days
        </p>
      </div>

      <div v-if="partners" class="d-flex align-center justify-center">
        <v-avatar color="dark lighten-2" size="8" />
        <p class="p--small dark--text ml-1 text-lighten-2">Shopee</p>
      </div>
      <v-spacer />
    </div>
    <v-btn
      v-if="showButton"
      block
      depressed
      small
      class="secondary h7--xxsmall text-capitalize"
      >Claim</v-btn
    >
  </div>
</template>

<script>
import media from "@/mixins/media";
import pipe from "@/mixins/pipe";
export default {
  mixins: [media, pipe],
  props: {
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
};
</script>

<style lang="scss" scoped>
.action_card {
  &-image {
    // max-width: 300px;
  }
}
</style>
