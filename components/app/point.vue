<template>
  <div class="d-flex items-center">
    <img class="mr-1" width="20" height="20" src="/images/coin.png" />
    <p class="h7--xxsmall dark--text">
      {{ points }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    points: {
      type: [Number, String],
      default: 0,
    },
  },
};
</script>
