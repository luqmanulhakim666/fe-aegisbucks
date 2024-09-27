<template>
  <v-expansion-panels flat class="mb-4 border-thin rounded-lg" focusable>
    <v-expansion-panel>
      <v-expansion-panel-header class="grey lighten-3">
        <span class="h6--xsmall">{{
          label ? label : "Syarat dan Ketentuan"
        }}</span>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <span class="mt-6" v-html="termAndConditions"></span>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    termAndConditions: String,
    label: String,
  },
};
</script>
