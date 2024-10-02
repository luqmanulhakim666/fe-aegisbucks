<template>
  <div class="page-not-found">
    <div class="page-not-found_content">
      <v-card flat width="300">
        <lotties-not-found />
      </v-card>
      <h4 class="h4--default">Page Not Found</h4>

      <v-btn
        @click="goBack()"
        depressed
        block
        class="primary text-capitalize h7--xxsmall mt-8"
      >
        Back
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-not-found {
  max-width: 500px;
  height: 100vh;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  margin: 0 auto;
  overflow: hidden;

  &_content {
    text-align: center;
  }
}
</style>
