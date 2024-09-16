<template>
  <v-dialog v-model="dialog" width="800" persistent>
    <div class="white pt-16 pb-6 px-6 rounded-xl">
      <general-empty-state
        :max_width="200"
        :img="`${$config.API_URL}/media/static/group_440.svg`"
        :title="title"
        :description="description"
      />
      <div class="d-flex justify-end mt-8">
        <v-btn
          class="text-capitalize secondary--text text--lighten-5 text--large"
          text
          @click="onClose()"
          >Nanti Saja</v-btn
        >
        <v-btn
          class="text-capitalize white--text secondary lighten-5 text--large"
          depressed
          @click="onEmitCompleteRegistration()"
          >Selanjutnya</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    title: String,
    description: String
  },

  methods: {
    onClose() {
      this.$emit('on:close')
    },

    onEmitCompleteRegistration() {
      this.$emit('on:register')
    }
  }
}
</script>
