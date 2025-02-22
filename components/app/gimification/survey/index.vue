<template>
  <v-card
    class="gimification-survey pa-6 rounded-xl fill-height pointer"
    flat
    color="#EC6484"
    @click="handleDialog()"
  >
    <h2 class="h2-xlarge white--text">Isi Survey</h2>
    <p class="h6--xsmall white--text">Fibe Mini</p>
    <img width="60" class="mt-4" src="/images/alfamart.png" alt="" />
    <img
      class="gimification-survey_overlay-img"
      height="150"
      src="/images/fibe.png"
      alt=""
    />

    <general-dialog-on-progress :dialog="dialog" @on:close="handleDialog()" />
  </v-card>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
  }),

  methods: {
    handleDialog() {
      this.dialog = !this.dialog;
    },
  },
};
</script>

<style lang="scss" scoped>
.gimification-survey {
  position: relative;

  &_overlay-img {
    right: 24px;
    top: -34px;
    position: absolute;
  }
}
</style>
