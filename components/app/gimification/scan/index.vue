<template>
  <v-card
    class="gimification-scan pa-6 rounded-xl fill-height pointer"
    flat
    color="#31288f"
    link
    to="/scan"
  >
    <h2 class="h2-xlarge white--text">Scan Struk</h2>
    <p class="h6--xsmall white--text">Bear Brand</p>
    <div class="d-flex">
      <img width="60" class="mt-4" src="/images/alfamart.png" alt="" />
      <img width="60" class="mt-4 ml-2" src="/images/indomart.png" alt="" />
    </div>
    <img
      class="gimification-scan_overlay-img"
      height="150"
      src="/images/bearbrand.png"
      alt=""
    />
  </v-card>
</template>

<style lang="scss" scoped>
.gimification-scan {
  position: relative;

  &_overlay-img {
    right: 24px;
    top: -34px;
    position: absolute;
  }
}
</style>
