<template>
  <div class="action_card">
    <img
      alt="Offer image"
      class="action_card-image full-width full-height cover"
      :src="item"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: String,
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
