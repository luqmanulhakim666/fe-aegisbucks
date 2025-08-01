<template>
  <div class="d-flex justify-center">
    <v-card
      flat
      :class="[
        'rounded-lg py-2 px-3 mx-1 full-width',
        target === 'incubator' ? 'primary lighten-4' : 'primary lighten-4',
      ]"
    >
      <p
        :class="[
          'h6--xsmall text-center',
          target === 'incubator'
            ? 'primary--text'
            : 'primary--text text--lighten-5',
        ]"
      >
        {{ humanizeRole(target) }}
      </p>
    </v-card>
  </div>
</template>

<script>
import pipe from "@/mixins/pipe";
export default {
  mixins: [pipe],
  props: {
    target: String,
  },
};
</script>
