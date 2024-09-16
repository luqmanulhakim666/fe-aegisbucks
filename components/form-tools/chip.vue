<template>
  <div class="primary lighten-4 px-3 py-2 rounded-xl d-inline-block">
    <p class="h6--xsmall info--text text--lighten-2">
      {{ label }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    label: String
  }
}
</script>
