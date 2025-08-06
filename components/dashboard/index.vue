<template>
  <div>
    <template v-if="reportLoading">
      <general-loading />
    </template>

    <template v-else>
      <general-report-header
        :isSearch="false"
        @on:fetchDateRange="filterDateRange"
      />

      <v-row class="mt-8">
        <v-col cols="12" lg="7">
          <div class="white rounded-xl">
            <div class="pa-6 d-md-flex justify-md-space-between align-center">
              <div class="d-flex">
                <v-icon color="primary lighten-5" size="44"
                  >mdi-bullhorn</v-icon
                >
                <div class="ml-4">
                  <div class="d-flex align-start">
                    <div>
                      <p class="h5--small dark--text text--lighten-5 mr-3">
                        {{ campaign.name }}
                      </p>
                      <p class="text--large dark--text text--lighten-1">
                        {{ campaign.brand.name }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <v-card
                flat
                :class="
                  campaign.published
                    ? ' h8--supersmall success white--text lighten-2'
                    : 'h8--supersmall  error white--text lighten-1'
                "
                class="py-2 px-4 rounded-pill d-inline-block mt-4 mt-md-0"
              >
                {{ campaign.published ? "Active" : "Inactive" }}
              </v-card>
            </div>
            <v-divider> </v-divider>
            <div class="d-md-flex justify-space-between">
              <div class="pa-6 d-flex">
                <v-icon color="success" size="34">mdi-cash-multiple</v-icon>
                <div class="ml-4">
                  <p class="p--default dark--text text--lighten-5">Budget</p>
                  <p class="h6--xsmall dark--text text--lighten-1">
                    {{ decimal(campaign.budget) }}
                  </p>
                </div>
              </div>
              <div class="pa-6 d-flex">
                <v-icon color="dark" size="34">mdi-calendar-range</v-icon>
                <div class="ml-4">
                  <p class="p--default dark--text text--lighten-5">
                    Flight Date
                  </p>
                  <p class="h6--xsmall dark--text text--lighten-1">
                    {{ dateMonthTextYear(campaign.publishedAt) }}
                  </p>
                </div>
              </div>

              <div class="pa-6 d-flex">
                <v-icon color="dark" size="34">mdi-calendar-range</v-icon>
                <div class="ml-4">
                  <p class="p--default dark--text text--lighten-5">
                    Expired Date
                  </p>
                  <p class="h6--xsmall dark--text text--lighten-1">
                    {{ dateMonthTextYear(campaign.expiredDate) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" lg="5">
          <div
            class="d-flex fill-height justify-space-between"
            style="gap: 20px"
          >
            <div class="pa-6 rounded-xl full-width info lighten-3">
              <p class="h6--xsmall info--text">Total Page Views</p>
              <h1 class="h1--xxlarge info--text">
                {{ decimal(getTotalPageView) }}
              </h1>
            </div>
            <div class="pa-6 full-width rounded-xl success lighten-3">
              <p class="h6--xsmall white--text text--lighten-5">
                Total Vouchers
              </p>
              <h1 class="h1--xxlarge white--text text--lighten-1">
                {{ decimal(getTotalVoucher) }}
              </h1>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row class="my-8" align-content="center">
        <template v-if="state.loading.summary">
          <general-loading />
        </template>

        <template v-if="!state.loading.summary">
          <v-col align-self="start" cols="12" xl="7" lg="6">
            <campaign-report-charts-trends
              class="fill-height my-auto"
              v-if="!state.loading.summary"
              :summary="items.summary"
            />

            <!-- <campaign-report-page-view :summary="items.summary" class="mt-6" /> -->
          </v-col>
          <v-col cols="12" xl="5" lg="6">
            <campaign-report-charts-product
              class="mb-6"
              v-if="!state.loading.summary"
              :summary="items.summary"
            />
            <campaign-report-charts-voucher-status
              v-if="!state.loading.summary"
              :summary="items.summary"
            />
          </v-col>
        </template>
      </v-row>

      <campaign-report-table
        label="Page Views Report"
        :items="items.pageViews"
        :body="body.pageViews"
        :paging="paging.pageViews"
        :headers="headers.pageViews"
        :isLoading="state.loading.pageViews"
        @on:change="onChangePaginationPageViews"
        @on:search="fetchPageView"
        @on:export="onExportPageViews"
      />

      <v-divider class="my-8 dark--text" />

      <campaign-report-table
        label="Product Stock By Partner"
        :items="items.productStocks"
        :body="body.productStocks"
        :paging="paging.productStocks"
        :headers="headers.productStocks"
        :isLoading="state.loading.productStocks"
        :paginate="false"
        @on:search="fetchProductStocks"
        @on:export="onExportProductPartner"
      />

      <v-divider class="my-8 dark--text" />

      <campaign-report-table
        label="UTM Reports"
        :items="items.claimByUtm"
        :headers="headers.claimByUtm"
        :isLoading="state.loading.claimByUtm"
        :paginate="false"
        :showSearch="false"
        @on:export="onExportClaimByUtm"
      />

      <v-divider class="my-8 dark--text" />

      <campaign-report-table
        showClaimStatus
        filterDateRange
        label="Voucher Claims"
        :items="items.voucherClaims"
        :body="body.voucherClaims"
        :paging="paging.voucherClaims"
        :headers="headers.voucherClaims"
        :isLoading="state.loading.voucherClaims"
        @on:search="fetchVoucherClaims"
        @on:change="onChangePaginationVoucherClaims"
        @on:export="onExportVoucherClaims"
        @on:fetchVoucherClaims="filterStatusVoucherClaims"
        @on:fetchDateRange="filterDateRangeVoucherClaims"
      />

      <v-divider class="my-6" />

      <!-- <div>
        <p class="h4--default primary--text mt-4 text--lighten-1">
          Hubspot API
        </p>
        <div class="my-4">
          <a
            href="/templates/hubspot-template.csv"
            download="hubspot-template.csv"
            >Download CSV</a
          >
        </div>

        <input
          class="d-none"
          ref="input"
          type="file"
          accept=".csv"
          @change="onFilePicked"
        />

        <v-btn
          class="grey lighten-3 primary--text text--lighten-5 text-capitalize h7--xxsmall"
          depressed
          :loading="state.loading.hubspot"
          @click="onOpenFile"
        >
          Upload CSV
        </v-btn>
      </div> -->

      <v-dialog v-model="state.loadingUpload" fullscreen persistent>
        <v-card
          color="transparent"
          class="full-width fill-height d-flex flex-column justify-center align-center"
        >
          <general-loading />
        </v-card>
      </v-dialog>

      <v-dialog v-model="state.resultDialog" width="500" persistent>
        <div class="white rounded-xl">
          <general-card-dialog-header
            name="Duplicate Email"
            @close="state.resultDialog = false"
          />
          <div class="pa-4 white rounded-xl">
            <v-card flat height="200" class="white overflow-auto">
              <ul>
                <li v-for="(item, index) in items.hubspotResults" :key="index">
                  {{ item }}
                </li>
              </ul>
            </v-card>
          </div>
        </div>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import pipe from "@/mixins/pipe";
export default {
  props: {
    campaign: Object,
    campaignId: String,
  },
  mixins: [pipe],
  data: () => ({
    reportLoading: false,

    body: {
      summary: {
        fromDate: "",
        toDate: "",
      },
      pageViews: {
        page: 1,
        limit: 10,
        keyword: "",
      },
      productStocks: {
        page: 1,
        limit: 10,
        keyword: "",
      },
      voucherClaims: {
        page: 1,
        limit: 10,
        keyword: "",
        claimed: "",
        fromDate: "",
        toDate: "",
        sort: "desc",
      },
    },

    paging: {
      pageViews: {},
      productStocks: {},
      voucherClaims: {},
    },

    state: {
      loadingUpload: false,
      resultDialog: false,
      loading: {
        hubspot: false,
        summary: false,
        pageViews: false,
        productStocks: false,
        voucherClaims: false,
        claimByUtm: false,
      },
    },

    headers: {
      claimByUtm: [
        {
          text: "No",
          value: "no",
          sortable: false,
          class: "dark--text h7--xxsmall",
          width: 30,
        },
        {
          text: "Link",
          value: "name",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Total",
          value: "total",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
      ],
      pageViews: [
        {
          text: "No",
          value: "no",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Access Time",
          value: "createdAt",
          sortable: false,
          class: "dark--text h7--xxsmall",
          width: 150,
        },
        {
          text: "Url",
          value: "url",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Event",
          value: "event",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Email",
          value: "email",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Phone",
          value: "phone",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "IP Address",
          value: "ipAddress",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Browser",
          value: "userAgent",
          align: "center",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Device Type",
          value: "deviceType",
          align: "center",
          sortable: false,
          class: "dark--text h7--xxsmall text-capitalize",
        },
        {
          text: "Device Model",
          value: "deviceOS",
          class: "dark--text h7--xxsmall",
        },
      ],
      productStocks: [
        {
          text: "No",
          value: "no",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },

        {
          text: "Name",
          value: "productName",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },

        {
          text: "Retail Partner",
          value: "retailName",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "total",
          value: "total",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Claimed",
          value: "claimed",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
      ],
      voucherClaims: [
        {
          text: "No",
          value: "no",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Retail Partner",
          value: "retailName",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Voucher Code",
          value: "voucherCode",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Expired Date",
          value: "expiredDate",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Status",
          value: "claimedStatus",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Claimed / Used Date",
          value: "claimedDate",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Customer Name",
          value: "name",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Phone Number",
          value: "phone",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "Email",
          value: "email",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
        {
          text: "IP Address",
          value: "ipAddress",
          sortable: false,
          class: "dark--text h7--xxsmall",
        },
      ],
    },
    items: {
      hubspotResults: [],
      summary: {},
      pageViews: [],
      productStocks: [],
      voucherClaims: [],
      claimByUtm: [],
      breadcrumbs: [
        { text: "Campaigns", slug: "/admin/campaigns" },
        { text: "", slug: "" },
      ],
    },
    id: null,
  }),

  async created() {
    this.reportLoading = true;

    this.id = await this.campaignId;

    this.items.breadcrumbs[1].text = this.campaign.name;
    this.fetch();
    this.fetchPageView();
    this.fetchProductStocks();
    this.fetchVoucherClaims();
    this.fetchClaimByUtm();

    this.reportLoading = false;
  },

  computed: {
    getTotalPageView() {
      return this.items.summary.pageView?.total || 0;
    },

    getTotalVoucher() {
      return this.items.summary.voucherCode?.total || 0;
    },
  },

  methods: {
    filterDateRange(val) {
      const fromDateInstance = val[0] ? this.$dayjs(val[0]).startOf("day") : "";

      const toDateInstance = val[1] ? this.$dayjs(val[1]).endOf("day") : "";

      let date_from = fromDateInstance ? fromDateInstance?.toISOString() : "";
      let date_to = toDateInstance ? toDateInstance?.toISOString() : "";
      let sameDay = date_from === date_to && !!date_from;
      if (sameDay) {
        date_to = fromDateInstance ? fromDateInstance?.toISOString() : "";
      }

      this.body.summary.fromDate = date_from;
      this.body.summary.toDate = date_to;
      this.fetch();
    },

    filterDateRangeVoucherClaims(val) {
      this.body.voucherClaims.page = 1;

      const fromDateInstance = val[0] ? this.$dayjs(val[0]).startOf("day") : "";

      const toDateInstance = val[1] ? this.$dayjs(val[1]).endOf("day") : "";

      let date_from = fromDateInstance ? fromDateInstance?.toISOString() : "";
      let date_to = toDateInstance ? toDateInstance?.toISOString() : "";
      let sameDay = date_from === date_to && !!date_from;
      if (sameDay) {
        date_to = fromDateInstance ? fromDateInstance?.toISOString() : "";
      }

      this.body.voucherClaims.fromDate = date_from;
      this.body.voucherClaims.toDate = date_to;
      this.fetchVoucherClaims();
    },

    async fetch() {
      this.state.loading.summary = true;
      const res = await this.$api.campaigns.report.getSummary(
        this.campaignId ? this.campaignId : this.id,
        this.body.summary
      );

      this.items.summary = res.data;

      this.state.loading.summary = false;
    },

    async fetchPageView() {
      this.state.loading.pageViews = true;

      const res = await this.$api.campaigns.report.getPageView(
        this.campaignId ? this.campaignId : this.id,

        this.body.pageViews
      );

      if (res.success) {
        this.items.pageViews = res.data.list?.map((x, index) => ({
          no:
            (this.body.pageViews.page - 1) * this.body.pageViews.limit +
            index +
            1,
          ...x,
        }));
        this.paging.pageViews = res.data.paging;
        this.paging.pageViews["totalPage"] = Math.ceil(
          this.paging.pageViews?.count / this.body.pageViews.limit
        );
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.loading.pageViews = false;
    },

    async fetchProductStocks() {
      this.state.loading.productStocks = true;

      const res = await this.$api.campaigns.report.getProductRetailStock(
        this.campaignId ? this.campaignId : this.id,

        this.body.productStocks
      );

      if (res.success) {
        this.items.productStocks = res.data?.map((x, index) => ({
          no:
            (this.body.productStocks.page - 1) * this.body.productStocks.limit +
            index +
            1,
          ...x,
        }));
        // this.paging.productStocks = res.data?.paging;
        // this.paging.productStocks["totalPage"] = Math.ceil(
        //   this.paging.productStocks?.count / this.body.productStocks.limit
        // );
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.loading.productStocks = false;
    },

    filterStatusVoucherClaims(val) {
      this.body.voucherClaims.page = 1;

      this.body.voucherClaims.claimed = val;
      this.fetchVoucherClaims();
    },

    async fetchVoucherClaims() {
      const res = await this.$api.campaigns.report.getVoucherClaims(
        this.campaignId ? this.campaignId : this.id,

        this.body.voucherClaims
      );

      if (res.success) {
        this.items.voucherClaims = res.data?.list?.map((x, index) => ({
          no:
            (this.body.voucherClaims.page - 1) * this.body.voucherClaims.limit +
            index +
            1,
          ...x,
        }));
        this.paging.voucherClaims = res.data?.paging;
        this.paging.voucherClaims["totalPage"] = Math.ceil(
          this.paging.voucherClaims?.count / this.body.voucherClaims.limit
        );
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.loading.voucherClaims = false;
    },

    async fetchClaimByUtm() {
      this.state.loading.claimByUtm = true;

      const res = await this.$api.campaigns.report.getClaimByUtm(
        this.campaignId ? this.campaignId : this.id
      );

      if (res.success) {
        let name = "";
        this.items.claimByUtm = res.data?.map((x, index) => ({
          no: index + 1,
          name: x.utmSource?.includes("ig")
            ? "Instagram"
            : x.utmSource?.includes("fb")
            ? "Facebook"
            : !!x.utmSource
            ? x.utmSource
            : "Organic",
          ...x,
        }));
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.loading.claimByUtm = false;
    },

    onChangePaginationVoucherClaims(val) {
      this.body.voucherClaims.page = val;
      this.fetchVoucherClaims();
    },

    onChangePaginationPageViews(val) {
      this.body.pageViews.page = val;
      this.fetchPageView();
    },

    onExportPageViews() {
      const token = this.$store.getters["auth/isToken"];

      const url = this.$api.campaigns.report.export(
        this.campaign?.id,
        "page-views",
        this.body.pageViews,
        token
      );
      window.open(url);
    },

    onExportProductPartner() {
      const token = this.$store.getters["auth/isToken"];

      const url = this.$api.campaigns.report.export(
        this.campaign?.id,
        "retail-product-stocks",
        this.body.productStocks,
        token
      );
      window.open(url);
    },

    onExportClaimByUtm() {
      const token = this.$store.getters["auth/isToken"];

      const url = this.$api.campaigns.report.export(
        this.campaign?.id,
        "voucher-claim-by-utm-source",
        this.body.productStocks,
        token
      );
      window.open(url);
    },

    onExportVoucherClaims() {
      const token = this.$store.getters["auth/isToken"];

      const url = this.$api.campaigns.report.export(
        this.campaign?.id,
        "voucher-claims",
        this.body.voucherClaims,
        token
      );
      window.open(url);
    },
  },

  watch: {
    async campaignId() {
      this.reportLoading = true;

      await this.fetch();
      await this.fetchPageView();
      await this.fetchProductStocks();
      await this.fetchVoucherClaims();
      await this.fetchClaimByUtm();

      this.reportLoading = false;
    },
  },
};
</script>
