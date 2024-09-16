<template>
  <div>
    <div class="d-flex align-center mb-2">
      <p
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
      </p>
      <p
        class="text-capitalize label-text ml-1 error--text"
        v-if="required"
        v-bind:class="{
          'h6--xsmall': bold,
          'text--default': !bold,
        }"
      >
        *
      </p>
    </div>

    <v-select
      :search-input.sync="search"
      v-bind="$attrs"
      v-on="$listeners"
      :placeholder="placeholder"
      @focus="active = true"
      @blur="active = false"
    >
      <template v-slot:prepend v-if="prepend">
        <v-icon
          v-bind:class="{
            'material-icons-outlined': prependOutline,
            'primary--text': active,
          }"
        >
          {{ $attrs["prepend-icon"] }}
        </v-icon>
      </template>

      <template v-slot:prepend-inner v-if="prependInner">
        <v-icon
          v-bind:class="{
            'material-icons-outlined': prependOutline,
            'primary--text': active,
          }"
        >
          {{ $attrs["prepend-inner-icon"] }}
        </v-icon>
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  props: {
    bold: {
      type: Boolean,
      default: () => false,
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
      default: () => "Ketik disini",
    },
    prepend: {
      type: Boolean,
      default: () => false,
    },
    prependInner: {
      type: Boolean,
      default: () => false,
    },
    prependOutline: {
      type: Boolean,
      default: () => false,
    },
    labelWhite: {
      type: Boolean,
      default: () => false,
    },
  },

  data: () => ({
    search: "",
    active: false,
  }),

  watch: {
    search(val) {
      this.$emit("search:autocomplete", val);
    },
  },
};
</script>
