<template>
  <div>
    <div class="pa-4 d-flex justify-space-between align-center">
      <h4 class="h5--small dark--text">{{ name }}</h4>
      <v-btn :disabled="loading" x-small icon @click="onEmitClose()">
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </div>

    <v-divider />
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    loading: Boolean
  },

  methods: {
    onEmitClose() {
      this.$emit('close')
    }
  }
}
</script>
