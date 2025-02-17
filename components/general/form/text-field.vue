<template>
  <div>
    <div class="d-flex align-center mb-2">
      <span
        class="text-capitalize label-text"
        v-if="label"
        v-bind:class="{
          'h6--xsmall': bold,
          'text--default': !bold,
          'white--text': labelWhite,
          'dark--text': !labelWhite,
        }"
      >
        {{ label }}
        <span
          class="text-capitalize label-text ml-1 error--text"
          v-if="required"
          v-bind:class="{
            'h6--xsmall': bold,
            'text--default': !bold,
          }"
        >
          *
        </span>
        <span
          class="text-capitalize label-text ml-1 info--text text--lighten-2"
          v-if="optional"
          v-bind:class="{
            'h6--xsmall': bold,
            'text--default': !bold,
          }"
        >
          (Opsional)
        </span>
      </span>
    </div>

    <v-text-field
      v-bind="$attrs"
      v-on="$listeners"
      :placeholder="placeholder"
      :class="['white', className]"
    >
      <template v-slot:prepend v-if="prepend">
        <div
          class="text-field__prepend d-flex align-center justify-center gray rounded-lg white--text"
        >
          <p class="black--text">{{ prependName }}</p>
        </div>
      </template>

      <template v-slot:append v-if="appendButton">
        <v-btn
          @click="handleAppendClick"
          x-small
          depressed
          class="secondary lighten-1 rounded-pill h7--xxsmall text-capitalize"
        >
          {{ appendName }}
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script>
export default {
  props: {
    className: String,
    bold: {
      type: Boolean,
      default: false,
    },
    optional: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: () => "",
    },
    required: {
      type: Boolean,
      default: () => false,
    },
    placeholder: {
      type: String,
      default: () => "Type Here",
    },
    prepend: {
      type: Boolean,
      default: () => false,
    },
    prependName: {
      type: String,
      default: () => "",
    },
    appendButton: {
      type: Boolean,
      default: () => false,
    },
    appendName: {
      type: String,
      default: () => "",
    },
    labelWhite: {
      type: Boolean,
      default: () => false,
    },
  },

  methods: {
    handleAppendClick() {
      this.$emit("on:append-click");
    },
  },
};
</script>

<style lang="scss" scoped>
.text-field__prepend {
  width: 61px;
}

.v-input--is-disabled {
  background-color: var(--v-gray-lighten3) !important;
}

::v-deep {
  .v-input__append-inner {
    margin: auto !important;
  }
}
</style>
