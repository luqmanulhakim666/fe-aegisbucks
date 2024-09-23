<template>
  <v-expansion-panels flat class="mb-4 border-thin rounded-lg" focusable>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <p class="h6--xsmall">Syarat dan Ketentuan</p>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <p v-html="termAndConditions"></p>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    termAndConditions: String,
  },
};
</script>
