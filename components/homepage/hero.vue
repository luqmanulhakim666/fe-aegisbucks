<template>
  <div class="hero d-flex align-center mb-6">
    <v-card width="100%" class="elevation-0 transparent mr-4">
      <general-form-text-field
        placeholder="Ketik nama barang incaran mu "
        outlined
        hide-details
        width="100%"
        className="rounded-xl d-flex full-width"
        append-icon="mdi-magnify"
      />
    </v-card>

    <v-btn depressed class="success text-capitalize h6--xsmall mt-2"
      >Cari</v-btn
    >
  </div>
  <!-- <div
    class="hero d-flex flex-column justify-center align-center text-center pa-6 mt-n11 mb-6"
  >
    <h2 class="h2--xlarge dark--text mb-4">Cari Barang Incaranmu !!</h2>
    <p class="p--default dark--text">
      Gunakan promo & penawaran-penawaran menarik <br />
      dari Letsbuy Asia untuk belanja di E-commerce langganmu
    </p>

    <v-card width="100%" class="elevation-0 transparent my-4">
      <general-form-text-field
        placeholder="Ketik nama barang incaran mu "
        outlined
        hide-details
        width="100%"
        className="rounded-xl d-flex full-width"
        append-icon="mdi-magnify"
      />
    </v-card>

    <v-btn depressed class="success text-capitalize h6--xsmall mt-3"
      >Cari</v-btn
    >
  </div> -->
</template>

<style lang="scss" scoped>
.hero {
  // background: rgb(191, 202, 193);
  // height: 300px;
}
</style>
