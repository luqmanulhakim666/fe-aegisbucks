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
    </div>

    <v-autocomplete
      v-model="form.tags"
      :items="items"
      :item-text="itemText"
      :item-value="itemValue"
      :placeholder="placeholder"
      hide-details="auto"
      hide-selected
      class="mt-2"
      dense
      bold
      outlined
      multiple
      @update:search-input="onSearch(search)"
      :rules="rules"
    >
      <template v-slot:selection="data">
        <v-chip
          color="dark lighten-2"
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          @click="data.select"
          @click:close="onRemoveItem(data.item)"
        >
          {{ data.item.name }}
        </v-chip>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
export default {
  props: {
    form: Object,
    items: {
      type: Array,
    },
    itemText: String,
    itemValue: String,

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

  data: () => ({
    search: "",
  }),

  computed: {
    rules() {
      return [
        this.form.tags.length > 0 || "*Setidaknya satu item harus dipilih",
      ];
    },
  },

  methods: {
    onSearch: debounce(function (val) {
      this.$emit("on:search", val);
    }, 500),

    onRemoveItem(item) {
      this.$emit("on:remove-item", item);
    },
  },
};
</script>
