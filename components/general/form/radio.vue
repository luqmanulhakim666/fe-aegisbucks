<template>
  <div>
    <p
      class="text-capitalize mb-n2 dark--text"
      v-if="label"
      v-bind:class="{ 'h6--xsmall': bold, 'text--default': !bold }"
    >
      {{ label }}
    </p>

    {{ options }}
    <v-radio-group
      :row="row"
      v-bind="$attrs"
      v-on="$listeners"
      :class="[className]"
    >
      <v-radio
        v-for="(option, index) in options"
        :key="index"
        :ripple="false"
        :label="option.label"
        :value="option.key"
      />
    </v-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    options: Array,
    className: String,
    row: {
      type: Boolean,
      default: false
    },
    bold: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: () => ''
    }
  }
}
</script>
