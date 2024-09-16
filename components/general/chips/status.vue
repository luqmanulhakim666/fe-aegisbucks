<template>
  <v-card
    flat
    :class="['py-1 px-2 rounded-lg d-inline-block', color]"
    :width="width"
  >
    <p :class="[textColor, 'h8--supersmall text-center']" style="border: none">
      {{ label }}
    </p>
  </v-card>
</template>

<script>
import pipe from "@/mixins/pipe";
export default {
  mixins: [pipe],
  props: {
    label: String,
    color: String,
    textColor: String,
    width: [String, Number],
  },
};
</script>
