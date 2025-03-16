<template>
  <div class="d-sm-flex align-center">
    <general-form-text-field
      v-if="showSearch"
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

    <general-form-autocomplete
      clearable
      v-if="filterByProductScan"
      v-model="form.productScan"
      placeholder="Search Brand"
      className="text-capitalize"
      outlined
      hide-details
      :items="items.productScan"
      item-text="name"
      return-object
      :loading="loading.productScan"
      @keydown="fetchProductScan"
      @change="selectProductScan"
    />

    <!-- SORT YEAR -->
    <general-form-dropdown
      label="Type"
      :defltLabel="defaultLabelFilter"
      :list="items.campaign_types"
      :active="state.campaignType"
      @set:active="onSetCampaignType"
      v-if="filterCampaignType"
      class="mr-3 ml-sm-0 mt-3 mt-md-0"
    />
    <!-- END SORT YEAR -->

    <!-- SORT DATE -->
    <general-form-dropdown
      defaultLabel="Newest"
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
import { SORT, CAMPAIGN_TYPES } from "@/data/general";
import debounce from "lodash/debounce";
import screen from "@/mixins/screen";

export default {
  mixins: [screen],
  props: {
    filterByProductScan: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    body: Object,
    label: String,
    placeholder: {
      type: String,
      default: "Search here...",
    },
    actionCreate: String,
    filterCampaignType: {
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
    form: {
      productScan: "",
    },
    state: {
      sortKey: "",
      campaignType: "",
    },
    loading: {
      productScan: false,
    },
    items: {
      sort: SORT,
      campaign_types: CAMPAIGN_TYPES,
      productScan: [],
    },
  }),

  created() {
    if (this.filterByProductScan) {
      this.fetchProductScan();
    }
    this.setQuery();
  },

  computed: {},

  methods: {
    selectProductScan(val) {
      this.$emit("fetch:verify-point", val);
    },

    fetchProductScan: debounce(async function (val) {
      const keyword = val?.target?._value;

      this.loading.productScan = true;

      const payload = {
        keyword: keyword,
        sort: "desc",
        page: 1,
        limit: 5,
      };

      const res = await this.$api.products.scan.getList({ ...payload });

      if (res.success) {
        this.items.productScan = res.data.list;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.loading.productScan = false;
    }, 500),

    setQuery() {
      const query = this.$route?.query;
      const keyword = query.keyword;
      const campaignType = query.campaignType;
      const sort = query.sort;

      this.search = keyword || "";
      this.state.sortKey = sort || "";
      this.state.campaignType = campaignType || "";
    },

    onSearch: debounce(function (val) {
      this.$emit("on:search", val || "");
    }, 500),

    onSetSort(val) {
      this.state.sortKey = val.key;
      this.$emit("on:sort", val.key);
    },

    onSetCampaignType(val) {
      this.state.campaignType = val.key;
      this.$emit("on:filterCampaignType", val.key);
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
