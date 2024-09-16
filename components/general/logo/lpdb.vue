<template>
  <v-img
    :max-width="max_width"
    :max-height="max_height"
    :src="`${$config.API_URL}/media/static/lpdb-logo_(1).svg`"
    alt="lpdb-logo"
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
