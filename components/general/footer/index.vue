<template>
  <div class="mx-auto">
    <span class="h8--supersmall dark--text text--lighten-5">
      &copy; {{ year }}</span
    >
  </div>
</template>

<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>
