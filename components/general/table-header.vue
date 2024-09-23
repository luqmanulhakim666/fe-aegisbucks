<template>
  <div class="d-sm-flex align-center">
    <general-form-text-field
      v-model="search"
      class="searchbar text--large"
      outlined
      prepend-inner-icon="mdi-magnify"
      :placeholder="placeholder"
      dense
      hide-details
      clearable
      @input="onSearch"
    />

    <v-btn
      class="secondary lighten-5 h7--xxsmall text-capitalize mt-3 mt-md-2 ml-0 ml-md-2"
      small
      depressed
      v-if="exportReport"
      @click="$emit('on:export')"
    >
      <v-icon small class="mr-2" color="white">mdi-file-chart</v-icon> export
    </v-btn>

    <v-spacer></v-spacer>

    <!-- SORT YEAR -->
    <general-form-dropdown
      label="Tahun"
      :defaultLabel="defaultLabelFilter"
      :list="getYearRange"
      :active="state.filterYear"
      @set:active="onSetFilterYear"
      v-if="filterYear"
      class="mr-3 ml-sm-0 mt-3 mt-md-0"
    />
    <!-- END SORT YEAR -->

    <!-- SORT DATE -->
    <general-form-dropdown
      defaultLabel="Terbaru"
      :list="items.sort"
      :active="state.sortKey"
      @set:active="onSetSort"
      v-if="sort"
      class="mr-3 ml-sm-0 mt-3 mt-md-0"
    />
    <!-- END SORT DATE -->

    <v-btn
      :block="isMobile"
      v-if="isCreated"
      depressed
      small
      class="secondary lighten-5 h7--xxsmall text-capitalize mt-3 mt-md-0"
      @click="onEmitAction()"
    >
      <v-icon small class="mr-2">mdi-plus</v-icon>
      Buat Baru
    </v-btn>
  </div>
</template>

<script>
import { SORT } from "@/data/general";
import debounce from "lodash/debounce";
import screen from "@/mixins/screen";

export default {
  mixins: [screen],
  props: {
    body: Object,
    label: String,
    placeholder: String,
    actionCreate: String,
    filterYear: {
      type: Boolean,
      default: false,
    },
    defaultLabelFilter: {
      type: String,
      default: "Semua",
    },
    isCreated: {
      type: Boolean,
      default: true,
    },
    createDialog: {
      type: Boolean,
      default: false,
    },
    sort: {
      type: Boolean,
      default: false,
    },
    reportUrl: String,
    exportReport: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    search: "",
    state: {
      sortKey: "",
      filterYear: "",
    },
    items: {
      sort: SORT,
    },
  }),

  created() {
    this.setQuery();
  },

  computed: {
    getYearRange() {
      let startYear = 2023;
      const currentYear = new Date().getFullYear();
      let years = ["semua"];

      while (startYear <= currentYear + 7) {
        years.push(startYear++);
      }

      return years?.map((x) => {
        return { name: x, key: x };
      });
    },
  },

  methods: {
    setQuery() {
      const query = this.$route?.query;
      const keyword = query.keyword;
      const year = query.year;
      const sort = query.sort;

      this.search = keyword || "";
      this.state.sortKey = sort || "";
      this.state.filterYear = Number(year) || "";
    },

    onSearch: debounce(function (val) {
      this.$emit("on:search", val || "");
    }, 500),

    onSetSort(val) {
      this.state.sortKey = val.key;
      this.$emit("on:sort", val.key);
    },

    onEmitAction() {
      if (this.createDialog) {
        this.$emit("on:dialog");
        return;
      }
      this.$router.push(this.actionCreate);
    },

    onEmitPreviewParameter() {
      this.$emit("preview:parameter");
    },
  },
};
</script>
