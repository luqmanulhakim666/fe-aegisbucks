<template>
  <v-dialog v-model="dialog" persistent width="600">
    <div class="white rounded-xl">
      <general-card-dialog-header
        :name="nameHeader"
        @close="onEmitClose()"
        v-if="!callToAction"
      />
      <div class="flex-column-center align-center py-10">
        <v-icon size="100" :color="color ? color : 'primary'" class="mb-8">{{
          icon ? icon : 'mdi-help-circle'
        }}</v-icon>

        <v-card flat class="pa-5">
          <h4 class="h4--default dark--text text--lighten-1 text-center">
            {{ title ? title : 'Apakah Anda yakin ingin menghapus data ini?' }}
          </h4>
          <p class="p--large mt-2 text-center dark--text" v-if="description">
            {{ description }}
          </p>
        </v-card>

        <div
          class="d-flex mt-6 mx-auto justify-space-around"
          v-if="callToAction"
        >
          <v-btn
            depressed
            block
            outlined
            class="mr-2 text-capitalize h7--xxsmall"
            :disabled="loading"
            @click="onEmitClose()"
            >Batal</v-btn
          >
          <v-btn
            depressed
            block
            :color="color ? color : 'primary'"
            class="ml-sm-2 text-capitalize h7--xxsmall"
            :loading="loading"
            @click="onEmitSubmit()"
            >{{ actionText }}</v-btn
          >
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: '',
    dialog: Boolean,
    loading: Boolean,
    icon: String,
    color: String,
    description: String,
    actionText: {
      type: String,
      default: 'Submit'
    },
    callToAction: {
      type: Boolean,
      default: true
    },
    nameHeader: String
  },

  methods: {
    onEmitClose() {
      this.$emit('on:close')
    },

    onEmitSubmit() {
      this.$emit('on:submit')
    }
  }
}
</script>
