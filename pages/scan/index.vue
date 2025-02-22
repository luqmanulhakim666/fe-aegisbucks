<template>
  <div class="container">
    <div
      v-for="i in 10"
      :key="i"
      class="d-flex justify-space-between align-center border-thin rounded-xl py-2 px-6 mb-6"
    >
      <div class="d-flex align-center">
        <v-img
          max-width="100"
          min-width="100"
          src="/images/bearbrand.png"
          alt="product"
        />

        <div>
          <p class="h6--xsmall mb-2 dark--text">Bearbrand 300ml</p>
          <app-point :points="300" />
        </div>
      </div>

      <v-btn
        depressed
        small
        class="success lighten-1 text-capitalize h7--xxsmall dark--text"
        @click="onSeeInstruction()"
        >Lihat Petunjuk</v-btn
      >
    </div>

    <app-gimification-scan-dialog-instruction
      @on:close="onSeeInstruction()"
      :dialog="dialog"
    />
  </div>
</template>

<script>
export default {
  layout: "app",

  data: () => ({
    selectedItem: {},
    dialog: false,
  }),

  methods: {
    onSeeInstruction() {
      this.dialog = !this.dialog;
    },
  },
};
</script>
