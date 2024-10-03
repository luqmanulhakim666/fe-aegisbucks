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
    <v-textarea
      v-bind="$attrs"
      v-on="$listeners"
      :placeholder="placeholder"
      row-height="7"
    >
      <template v-slot:prepend v-if="prepend">
        <div
          class="textarea__prepend d-flex align-center justify-center gray rounded-lg"
        >
          <p class="black--text">{{ prependName }}</p>
        </div>
      </template>
    </v-textarea>
  </div>
</template>

<script>
export default {
  props: {
    bold: {
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
    optional: {
      type: Boolean,
      default: () => false,
    },
    placeholder: {
      type: String,
      default: () => "Type here",
    },
    labelWhite: {
      type: Boolean,
      default: () => false,
    },
    prepend: {
      type: Boolean,
      default: () => false,
    },
    prependName: {
      type: String,
      default: () => "",
    },
  },
};
</script>

<style lang="scss" scoped>
.textarea__prepend {
  width: 61px;
}
</style>
