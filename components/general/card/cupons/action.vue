<template>
  <div class="action_card elevation-1 pa-2 rounded-xl">
    <img
      alt="Offer image"
      class="action_card-image full-width rounded-xl"
      :src="image"
    />

    <p class="h7--xxsmall">
      {{ title }}
    </p>

    <div class="d-flex align-center mt-6 mb-4">
      <div class="d-flex align-center mr-4">
        <v-icon size="12" color="dark lighten-2">mdi-clock</v-icon>
        <p class="p--small ml-2 dark--text text-lighten-2">
          {{ expiredDate }} Days
        </p>
      </div>

      <div v-if="ecommerce" class="d-flex align-center justify-center">
        <v-avatar color="dark lighten-2" size="8" />
        <p class="p--small dark--text ml-1 text-lighten-2">Shopee</p>
      </div>
      <v-spacer />
    </div>
    <v-btn
      v-if="isCTA"
      block
      depressed
      small
      class="secondary h7--xxsmall text-capitalize"
      >Claim</v-btn
    >
  </div>
</template>

<script>
export default {
  props: {
    image: String,
    title: String,
    expiredDate: Number,
    ecommerce: {
      type: Boolean,
      default: false,
    },
    isCTA: {
      type: Boolean,
      default: false,
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
