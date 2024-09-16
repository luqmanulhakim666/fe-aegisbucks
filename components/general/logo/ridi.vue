<template>
  <v-img
    contain
    :max-width="max_width"
    :max-height="max_height"
    :src="`${$config.API_URL}/media/static/new-logo.svg`"
    alt="ridi-logo"
  />
</template>

<script>
export default {
  props: {
    max_width: [String, Number],
    max_height: [String, Number]
  }
}
</script>
