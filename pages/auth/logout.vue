<template>
  <div class="logout background-gradient-1">
    <div class="logout__loading">
      <div class="d-flex mx-auto">
        <general-logo-lpdb :max_width="200" class="mr-2" />
        <general-logo-ridi :max_width="85" class="ml-2" />
      </div>
      <v-progress-circular
        class="mt-10"
        width="5"
        color="primary"
        size="60"
        indeterminate
      />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  created() {
    this.$store.dispatch('auth/logout')
  }
}
</script>

<style lang="scss" scoped>
.logout {
  height: 100vh;
  overflow: hidden;
  &__loading {
    position: fixed;
    text-align: center;
    top: 40%;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
