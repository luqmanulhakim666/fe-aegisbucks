<template>
  <div>
    <p
      class="text-capitalize mb-2 dark--text"
      v-if="label"
      v-bind:class="{ 'h6--xsmall': bold, 'text--default': !bold }"
    >
      {{ label }}
    </p>
    <client-only>
      <vue-timepicker
        input-width="100%"
        class="rounded-lg"
        v-bind="$attrs"
        v-on="$listeners"
        :placeholder="placeholder"
      />
    </client-only>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: () => ''
    },
    bold: {
      type: Boolean,
      default: () => false
    },
    required: {
      type: Boolean,
      default: () => false
    },
    placeholder: {
      type: String,
      default: () => 'Type Here'
    },
    prepend: {
      type: Boolean,
      default: () => false
    },
    prependName: {
      type: String,
      default: () => ''
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .vue__time-picker input.display-time {
  border-radius: 6px;
}
</style>
