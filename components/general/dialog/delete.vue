<template>
  <v-dialog v-model="dialog" persistent width="600">
    <div class="white rounded-xl flex-column-center align-center py-10">
      <v-icon size="100" color="error lighten-1">mdi-delete</v-icon>
      <h4 class="h4--default text-center dark--text text--lighten-1">
        Apakah Anda yakin ingin menghapus data ini?
      </h4>

      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-btn
            depressed
            block
            outlined
            class="text-capitalize h7--xxsmall"
            :disabled="loading"
            @click="onEmitClose()"
            >Batal</v-btn
          ></v-col
        >
        <v-col cols="12" md="6"
          ><v-btn
            depressed
            block
            class="error lighten-1 ml-sm-2 text-capitalize h7--xxsmall"
            :loading="loading"
            @click="onEmitDelete()"
            >Hapus</v-btn
          ></v-col
        >
      </v-row>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    loading: Boolean,
  },

  methods: {
    onEmitClose() {
      this.$emit("on:close");
    },

    onEmitDelete() {
      this.$emit("on:delete");
    },
  },
};
</script>
