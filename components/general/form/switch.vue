<template>
  <div>
    <p
      class="text-capitalize mb-2 dark--text"
      v-if="label"
      v-bind:class="{ 'h6--xsmall': bold, 'text--default': !bold }"
    >
      {{ label }}
    </p>

    <v-switch
      v-model="value"
      v-bind="$attrs"
      v-on="$listeners"
      inset
      :ripple="false"
      :class="[className]"
    >
      <template v-slot:prepend v-if="prepend">
        <div
          class="text-field__prepend d-flex align-center justify-center gray rounded-lg"
        >
          <p
            class="text-capitalize dark--text mr-2"
            v-bind:class="{ 'h6--xsmall': bold, 'text--default': !bold }"
          >
            {{ prependName }}
          </p>
        </div>
      </template>
    </v-switch>
  </div>
</template>

<script>
export default {
  props: {
    className: String,
    bold: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: () => ''
    },
    prepend: {
      type: Boolean,
      default: () => false
    },
    prependName: {
      type: String,
      default: () => ''
    },
    switchValue: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    value: false
  }),
  methods: {
    inputValue(val) {
      this.value = val
    }
  },
  watch: {
    switchValue: {
      handler(val) {
        if (val) {
          this.inputValue(val)
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.text-field__prepend {
  width: 61px;
}

.v-input--is-disabled {
  background-color: var(--v-gray-lighten3) !important;
}
</style>
