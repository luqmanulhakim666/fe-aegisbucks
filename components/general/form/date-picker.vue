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

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateText"
          :rules="rules"
          outlined
          append-icon="mdi-calendar"
          readonly
          :placeholder="placeholder"
          v-bind="attrs"
          v-on="on"
          hide-details="auto"
        />
      </template>
      <v-date-picker
        v-bind="$attrs"
        v-on="$listeners"
        color="#1B70A8"
        @input="onInputDate"
      />
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    dateValue: String,
    rules: Array,
    required: {
      type: Boolean,
      default: false,
    },
    optional: {
      type: Boolean,
      default: false,
    },
    bold: {
      type: Boolean,
      default: () => false,
    },
    label: {
      type: String,
      default: () => "",
    },
    labelWhite: {
      type: Boolean,
      default: () => false,
    },
    placeholder: {
      type: String,
      default: () => "Pilih Tanggal",
    },
    formatDateText: String,
  },

  data: () => ({
    menu: false,
    date: "",
  }),

  computed: {
    dateText() {
      let text = this.formatDateText ? this.formatDateText : "ddd, DD MMM YYYY";
      return this.date ? this.$dayjs(this.date).format(text) : "";
    },
  },

  methods: {
    onInputDate(val) {
      this.date = val;
      this.menu = false;
    },
  },

  watch: {
    dateValue: {
      handler(val) {
        if (val) {
          this.onInputDate(val);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.v-input--is-disabled {
  background-color: var(--v-gray-lighten3) !important;
}
</style>
