<template>
  <div>
    <video
      ref="videoPlayer"
      controls
      disablepictureinpicture
      controlslist="nodownload"
      class="rounded-xl"
    >
      <source :src="videoSource" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  props: {
    videoSource: String
  },
  mounted() {
    this.$refs.videoPlayer.addEventListener('play', this.handlePlay)
  },
  beforeDestroy() {
    this.$refs.videoPlayer.removeEventListener('play', this.handlePlay)
  },
  methods: {
    handlePlay() {
      // this.$emit('on:finish')
    }
  }
}
</script>

<style lang="scss" scoped>
video {
  width: 100% !important;
  height: auto !important;
}
</style>
