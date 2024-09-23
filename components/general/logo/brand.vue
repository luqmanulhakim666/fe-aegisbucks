<template>
  <v-img
    contain
    :max-width="max_width"
    :max-height="max_height"
    :src="logo"
    alt="ridi-logo"
  />
</template>

<script>
export default {
  props: {
    logo: String,
    max_width: [String, Number],
    max_height: [String, Number],
  },
};
</script>
