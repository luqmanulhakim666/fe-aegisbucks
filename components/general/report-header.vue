<template>
  <div class="d-md-flex justify-space-between flex-grow-1">
    <div class="d-flex" v-if="isSearch">
      <general-form-text-field
        v-model="search"
        class="searchbar text--large mb-4 mb-md-0"
        pill
        append-icon="mdi-magnify"
        :placeholder="placeholder"
        outlined
        dense
        hide-details
        clearable
        cache-items
        @input="onSearch"
      />
    </div>

    <div class="d-md-flex">
      <v-menu
        v-if="filterDateRange"
        v-model="state.isActiveDateRange"
        :close-on-content-click="false"
        :return-value.sync="dateRange.date"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-if="filterDate"
            placeholder="Select date"
            class="white lighten-2 border-none"
            pill
            outlined
            hide-details
            v-model="dateRangeText"
            readonly
            v-bind="attrs"
            v-on="on"
          >
            <template v-slot:append>
              <div class="d-flex">
                <v-icon
                  v-if="dateRange.length"
                  class="pointer mr-1"
                  @click="onCleareDateRange()"
                  >mdi-close</v-icon
                >
                <v-icon>mdi-calendar</v-icon>
              </div>
            </template>
          </v-text-field>
        </template>
        <v-date-picker
          range
          color="primary"
          v-model="dateRange"
          @input="onSelectDateRange()"
          :max="maxDate"
          no-title
        >
        </v-date-picker>
      </v-menu>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";

export default {
  props: {
    placeholder: String,
    isSearch: {
      type: Boolean,
      default: true,
    },
    filterDateRange: {
      type: Boolean,
      default: true,
    },
    filterDate: {
      type: Boolean,
      default: () => true,
    },
  },
  data: () => ({
    search: "",
    dateRange: [],
    state: {
      isActiveDateRange: false,
    },
    filter: "",
  }),

  computed: {
    dateRangeText() {
      let data = JSON.parse(JSON.stringify(this.dateRange));

      if (Date.parse(data[1]) < Date.parse(data[0])) {
        let temp = data[1];
        data[1] = this.$dayjs(data[0]).format("DD MMM YYYY");
        data[0] = this.$dayjs(temp).format("DD MMM YYYY");
      }

      if (Date.parse(data[1]) > Date.parse(data[0])) {
        data[0] = this.$dayjs(data[0]).format("DD MMM YYYY");
        data[1] = this.$dayjs(data[1]).format("DD MMM YYYY");
      }

      if (Date.parse(data[1]) === Date.parse(data[0])) {
        data[0] = this.$dayjs(data[0]).format("DD MMM YYYY");
        data[1] = this.$dayjs(data[1]).format("DD MMM YYYY");
      }

      if (data?.length === 1) {
        data[0] = this.$dayjs(data[0]).format("DD MMM YYYY");
      }

      return data.join(" ~ ");
    },

    maxDate() {
      let date = new Date();

      return this.$dayjs(date).format("YYYY-MM-DD");
    },
  },

  methods: {
    onSelectDateRange() {
      if (this.dateRange.length) {
        this.state.isActiveDateRange = this.dateRange.length < 2;
      }
    },

    onCleareDateRange() {
      this.dateRange = [];
      this.$emit("on:fetchDateRange", this.dateRange);
    },

    onSearch: debounce(function (val) {
      this.$emit("on:search", val || "");
    }, 500),

    onFilterDateRange: debounce(function (val) {
      this.$emit("on:fetchDateRange", this.dateRange);
    }, 300),
  },

  watch: {
    search(val) {
      this.onSearch(val);
    },

    dateRange: {
      handler(val) {
        if (Date.parse(val[1]) < Date.parse(val[0])) {
          let temp = val[1];
          this.dateRange[1] = val[0];
          this.dateRange[0] = temp;
        }
        if (val?.length > 1) {
          this.onFilterDateRange();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.filter {
  background-color: #fff;
  border-radius: 50px;

  &:hover {
    cursor: pointer;
  }

  .h7--xxsmall {
    color: var(--v-dark-lighten4) !important;
  }

  &--active {
    background-color: #cfdfff;
    color: #2750ae;
    border: solid 1px #2750ae;

    .h7--xxsmall {
      color: #2750ae !important;
    }
  }
}
</style>
