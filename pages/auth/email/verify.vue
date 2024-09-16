<template>
  <div class="verify background-gradient-1">
    <div class="verify__loading">
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
  data: () => ({
    form: {}
  }),

  created() {
    let isSuccess = this.$route?.query?.success === 'true'
    setTimeout(() => {
      if (isSuccess) {
        this.$router.push('/login')
      }

      if (!isSuccess) {
        this.$router.push('/')
      }
    }, 2000)
  }
}
</script>

<style lang="scss" scoped>
.verify {
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
