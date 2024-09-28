<template>
  <div>
    <general-breadcrumbs :lists="items.breadcrumbs" class="mb-9" />

    <general-report-header :isSearch="false" />

    <campaign-report-table
      label="Page Views Report"
      :items="items.pageViews"
      :body="body.pageViews"
      :paging="paging.pageViews"
      :headers="headers.pageViews"
      :isLoading="state.loading.pageViews"
      @on:change="onChangePaginationPageViews"
      @on:search="fetchPageView"
    />

    <v-divider class="my-8 dark--text" />

    <campaign-report-table
      label="Product Stock By Partner"
      :items="items.productStocks"
      :body="body.productStocks"
      :paging="paging.productStocks"
      :headers="headers.productStocks"
      :isLoading="state.loading.productStocks"
      @on:change="onChangePaginationProductStocks"
      @on:search="fetchProductStocks"
    />
  </div>
</template>

<script>
import meta from "@/mixins/meta";
export default {
  async asyncData({ route, app }) {
    const id = route.params?.id;
    let campaign = {};
    if (!id) {
      redirect("/campaign/404");
    }

    const res = await app.$api.campaigns.getOne(id);

    if (res.success) {
      campaign = res.data;
    }

    return { id: id, campaign: campaign };
  },
  mixins: [meta],

  data: () => ({
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
    },

    paging: {
      pageViews: {},
      productStocks: {},
    },

    state: {
      loading: {
        summary: false,
        pageViews: false,
        productStocks: false,
      },
    },

    headers: {
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
    },

    items: {
      pageViews: [],
      productStocks: [],
      breadcrumbs: [
        { text: "Campaigns", slug: "/admin/campaigns" },
        { text: "", slug: "" },
      ],
    },
  }),
  created() {
    this.items.breadcrumbs[1].text = this.campaign.name;
    this.fetch();
    this.fetchPageView();
    this.fetchProductStocks();
  },

  mounted() {
    this.setMeta("Report", true);
  },

  methods: {
    async fetch() {
      this.state.loading.summary = true;
      const res = await this.$api.campaigns.report.getSummary(
        this.id,
        this.body.summary
      );

      this.state.loading.summary = false;
    },

    async fetchPageView() {
      this.state.loading.pageViews = true;

      const res = await this.$api.campaigns.report.getPageView(
        this.id,
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
        this.id,
        this.body.productStocks
      );

      if (res.success) {
        this.items.productStocks = res.data.list?.map((x, index) => ({
          no:
            (this.body.productStocks.page - 1) * this.body.productStocks.limit +
            index +
            1,
          ...x,
        }));
        this.paging.productStocks = res.data.paging;
        this.paging.productStocks["totalPage"] = Math.ceil(
          this.paging.productStocks?.count / this.body.productStocks.limit
        );
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.loading.productStocks = false;
    },

    onChangePaginationPageViews(val) {
      this.body.pageViews.page = val;
      this.fetchPageView();
    },

    onChangePaginationProductStocks(val) {
      this.body.productStocks.page = val;
      this.fetchProductStocks();
    },
  },
};
</script>
