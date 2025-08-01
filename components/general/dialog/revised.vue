<template>
  <v-dialog v-model="dialog" width="800" persistent>
    <div class="white pt-16 pb-6 px-6 rounded-xl">
      <general-empty-state
        :max_width="200"
        :img="`${$config.API_URL}/media/static/group_440.svg`"
        title="Ada beberapa dokumen yang harus Anda revisi"
      />
      <div class="d-flex justify-end mt-8">
        <v-btn
          class="text-capitalize primary--text text--lighten-5 text--large"
          text
          @click="onClose()"
          >Nanti Saja</v-btn
        >
        <v-btn
          class="text-capitalize white--text primary lighten-5 text--large"
          depressed
          @click="onEmitRevised()"
          >Revisi Sekarang</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
  },

  methods: {
    onClose() {
      this.$emit("on:close");
    },

    onEmitRevised() {
      this.$emit("on:revised");
    },
  },
};
</script>
