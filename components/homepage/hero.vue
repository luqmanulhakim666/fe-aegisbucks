<template>
  <div class="hero d-flex align-center mb-6">
    <v-card width="100%" class="elevation-0 transparent mr-4">
      <general-form-text-field
        v-model="keyword"
        placeholder="Ketik nama barang incaran mu "
        outlined
        hide-details
        width="100%"
        className="rounded-xl d-flex full-width"
        append-icon="mdi-magnify"
        @keypress.enter="onSearch()"
      />
    </v-card>

    <v-btn
      :disabled="!keyword"
      depressed
      @click="onSearch()"
      class="success text-capitalize h6--xsmall mt-2"
      >Cari</v-btn
    >
  </div>
</template>

<script>
export default {
  data: () => ({
    keyword: "",
  }),
  methods: {
    onSearch() {
      this.$router.push(`/search?keyword=${this.keyword}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.hero {
  // background: rgb(191, 202, 193);
  // height: 300px;
}
</style>
