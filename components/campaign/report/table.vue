<template>
  <div>
    <div class="d-md-flex align-center mb-6">
      <p class="h4--default dark--text mt-4 text--lighten-1">
        {{ label }}
      </p>
      <v-spacer />

      <general-table-header
        :isCreated="false"
        :showSearch="showSearch"
        @on:search="onSearch"
        @on:export="onExport"
      />
    </div>

    <div class="d-flex align-center">
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
            class="white lighten-2 border-none mr-2 mt-2"
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

      <general-form-select
        v-if="showClaimStatus"
        v-model="status"
        :items="claimStatus"
        item-value="key"
        hide-details
        item-text="text"
        bold
        outlined
        dense
      />
    </div>

    <v-data-table
      :headers="headers"
      :loading="isLoading"
      :items="items"
      hide-default-footer
      no-data-text="No Data"
      class="mt-4 border-thin"
    >
      <template v-slot:[`item.deviceType`]="{ item }">
        <p class="text-capitalize">{{ item.deviceType }}</p>
      </template>

      <template v-slot:[`item.createdAt`]="{ item }">
        <p class="text-capitalize">
          {{ fullDateMonthTextYear(item.createdAt, "-") }}
        </p>
      </template>

      <template v-slot:[`item.expiredDate`]="{ item }">
        <p class="text-capitalize">
          {{ fullDateMonthTextYear(item.expiredDate, "-") }}
        </p>
      </template>

      <template v-slot:[`item.claimedDate`]="{ item }">
        <p class="text-capitalize">
          {{ fullDateMonthTextYear(item.claimedDate, "-") }}
        </p>
      </template>

      <template v-slot:[`item.claimedStatus`]="{ item }">
        <general-chips-status
          :label="item.claimed ? 'Claimed' : 'Not Claimed'"
          :color="item.claimed ? 'success lighten-2' : 'error lighten-2'"
          textColor="white--text"
          width="100"
        />
      </template>

      <template v-slot:[`item.claimed`]="{ item }">
        <p class="text-capitalize">{{ decimal(item.claimed) }}</p>
      </template>

      <template v-slot:[`item.total`]="{ item }">
        <p class="text-capitalize">{{ decimal(item.total) }}</p>
      </template>
    </v-data-table>

    <general-pagination
      v-if="paginate"
      class="mt-6"
      :perPage="body.limit"
      :total="paging.count"
      :totalPage="paging.totalPage"
      :paging="paging"
      @on:change="onChangePagination"
    />
  </div>
</template>

<script>
import pipe from "@/mixins/pipe";
import debounce from "lodash/debounce";

export default {
  mixins: [pipe],
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    paginate: {
      type: Boolean,
      default: true,
    },
    filterDateRange: {
      type: Boolean,
      default: false,
    },
    filterDate: {
      type: Boolean,
      default: () => true,
    },
    showClaimStatus: {
      type: Boolean,
      default: false,
    },
    label: String,
    items: Array,
    headers: Array,
    isLoading: Boolean,
    body: Object,
    paging: Object,
  },

  data: () => ({
    dateRange: [],
    status: "",
    claimStatus: [
      { key: "", text: "Semua" },
      { key: true, text: "Claimed" },
      { key: false, text: "Not Claimed" },
    ],
    state: {
      isActiveDateRange: false,
    },
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

    onFilterDateRange: debounce(function (val) {
      this.$emit("on:fetchDateRange", this.dateRange);
    }, 300),

    onChangePagination(val) {
      this.$emit("on:change", val);
    },

    onExport() {
      this.$emit("on:export");
    },

    onSearch(val) {
      this.body.page = 1;
      this.body.keyword = val;

      this.$emit("on:search");
    },
  },
  watch: {
    status(val) {
      this.$emit("on:fetchVoucherClaims", val);
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
