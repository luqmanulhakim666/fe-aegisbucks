<template>
  <v-img
    contain
    :max-width="max_width"
    :max-height="max_height"
    src="/logo-x.png"
    alt="ridi-logo"
  />
</template>

<script>
export default {
  props: {
    max_width: [String, Number],
    max_height: [String, Number],
  },
};
</script>
