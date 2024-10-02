<!-- components/LottieAnimation.vue -->

<template>
  <div ref="lottieContainer"></div>
</template>

<script>
export default {
  mounted() {
    this.setupLottie();
  },
  methods: {
    setupLottie() {
      import("lottie-web").then((lottie) => {
        this.lottieInstance = lottie.default.loadAnimation({
          container: this.$refs.lottieContainer,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: require("@/assets/lotties/not-found.json"),
        });
      });
    },
  },
  beforeDestroy() {
    if (this.lottieInstance) {
      this.lottieInstance.destroy();
    }
  },
};
</script>

<style scoped>
/* Add any necessary styles for your Lottie animation container */
</style>
