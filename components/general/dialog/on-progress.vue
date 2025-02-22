<template>
  <v-dialog v-model="dialog" persistent width="600">
    <div
      class="white rounded-xl container flex-column-center align-center py-10"
    >
      <v-img class="d-flex mx-auto" max-width="200" src="/images/empty.svg" />

      <v-card flat class="pa-5">
        <p class="h5--small dark--text text--lighten-1 text-center">
          Fitur ini masih dalam pengembangan
        </p>
      </v-card>

      <v-btn
        depressed
        block
        class="mt-6 text-capitalize h7--xxsmall secondary"
        @click="onEmitClose()"
        >Tutup</v-btn
      >
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
  },

  methods: {
    onEmitClose() {
      this.$emit("on:close");
    },
  },
};
</script>
