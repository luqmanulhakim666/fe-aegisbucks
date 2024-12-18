<template>
  <div
    class="hero d-flex flex-column justify-center align-center text-center pa-6 mt-n11 mb-6"
  >
    <h2 class="h2--xlarge white--text mb-4">Cari Barang Incaranmu !!</h2>
    <p class="p--default white--text">
      Gunakan promo & penawaran-penawaran menarik <br />
      dari Letsbuy Asia untuk belanja di E-commerce langganmu
    </p>

    <!-- <v-card flat width="100%" transparent> -->
    <!-- <v-responsive width="100%" class="flex"> -->
    <general-form-text-field
      outlined
      hide-details
      width="100%"
      className="rounded-xl d-flex full-width"
    />
    <!-- </v-responsive> -->
    <!-- </v-card> -->

    <v-btn class="mt-3">Cari</v-btn>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  background: grey;
  height: 300px;
}
</style>
