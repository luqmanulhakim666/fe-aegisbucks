<template>
  <div class="d-flex items-center">
    <img class="mr-1" width="20" height="20" src="/images/coin.png" />
    <p class="h7--xxsmall dark--text">
      {{ decimal(points) }}
    </p>
  </div>
</template>

<script>
import utils from "@/mixins/utils";
export default {
  mixins: [utils],
  props: {
    points: {
      type: [Number, String],
      default: 0,
    },
  },
};
</script>
