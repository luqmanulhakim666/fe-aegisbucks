<template>
  <div class="shadow-base app-navbar">
    <div class="app-navbar_wrapper mx-auto px-10 py-4">
      <div class="d-flex justify-space-between">
        <general-logo :max_width="200" />
        <v-icon size="38">mdi-account-circle</v-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    logo: String,
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.app-navbar {
  &_wrapper {
    max-width: 961px;
  }
  &_logo {
    max-width: 300px;
    width: 100%;
    z-index: 0;
  }
}
</style>
