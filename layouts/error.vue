<template>
  <v-app dark>
    <div class="error_page background-gradient-1">
      <div class="error_page__content">
        <div class="d-flex mx-auto">
          <general-logo-lpdb :max_width="200" class="mr-2" />
          <general-logo-ridi :max_width="100" class="ml-2" />
        </div>
        <h4 class="h4--default text-center secondary--text mt-8 mb-4">
          {{ message }}
        </h4>

        <v-btn
          @click="goBack()"
          block
          class="primary-create-btn h4--default"
          depressed
          >Kembali</v-btn
        >
      </div>
    </div>
    <snackbar />
  </v-app>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
  computed: {
    message() {
      let pageNotFound = this.error.statusCode === 404;
      return pageNotFound ? "Halaman Tidak Ditemukan" : "An Error Occured";
    },
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.error_page {
  height: 100vh;
  overflow: hidden;
  &__content {
    position: fixed;
    text-align: center;
    top: 40%;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
