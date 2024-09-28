<template>
  <div class="white pa-6 rounded-xl">
    <h5 class="h5--small mb-6 dark--text text--lighten-1">{{ voucherName }}</h5>
    <div class="d-md-flex mb-4">
      <v-btn class="mt-2 mr-4" icon @click="goBack()"
        ><v-icon>mdi-arrow-left</v-icon></v-btn
      >
      <general-table-header
        label="Brand"
        :exportReport="false"
        :isCreated="false"
        @on:search="onSearch"
      />

      <v-spacer></v-spacer>

      <general-form-dropdown
        defaultLabel="All"
        :list="items.sort"
        :active="state.sortKey"
        @set:active="onSetSort"
      />
    </div>

    <v-data-table
      :headers="headers"
      :loading="state.isLoading"
      :items="items.voucherCodes"
      hide-default-footer
      no-data-text="No Data"
      class="mt-2 border-thin"
    >
      <template v-slot:[`item.voucherName`]="{ item }">
        Voucher {{ item.retail.name }}
        {{ item.campaignProduct.product.name }}
      </template>

      <template v-slot:[`item.claimed`]="{ item }">
        <general-chips-status
          :label="item.claimed ? 'Claimed' : 'Not Claimed'"
          :color="item.claimed ? 'success lighten-2' : 'error lighten-2'"
          textColor="white--text"
          width="100"
        />
      </template>
    </v-data-table>

    <general-pagination
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
export default {
  props: {
    voucherId: String,
    voucherName: String,
  },
  mixins: [pipe],
  middleware: ["authenticated", "authorized"],
  meta: {
    page: "admin",
  },

  data: () => ({
    headers: [
      {
        text: "No",
        value: "no",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Voucher Code",
        value: "code",
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

    body: {
      page: 1,
      limit: 10,
      keyword: "",
      claimed: null,
    },
    paging: {},
    state: {
      isLoading: false,
      sortKey: "",
    },
    items: {
      voucherCodes: [],
      sort: [
        { name: "Claimed", key: "claimed" },
        { name: "Not Claiemd", key: "not_claimed" },
      ],
    },
  }),

  created() {
    this.fetch();
  },

  methods: {
    async fetch() {
      const id = this.$route.params.slug;
      this.state.fetchLoading = true;

      const res = await this.$api.campaigns.voucher.getListVoucherCode(
        id,
        this.voucherId,
        this.body
      );

      if (res.success) {
        this.items.voucherCodes = res.data.list?.map((x, index) => ({
          no: (this.body.page - 1) * this.body.limit + index + 1,
          ...x,
        }));
        this.paging = res.data.paging;
        this.paging["totalPage"] = Math.ceil(
          this.paging?.count / this.body.limit
        );
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.fetchLoading = false;
    },

    onSearch(val) {
      this.body.keyword = val || "";
      this.body.page = 1;
      this.fetch();
    },

    onChangePagination(val) {
      this.body.page = val;
      this.fetch();
    },

    onSetSort(val) {
      this.body.claimed = val.key === "claimed";
      this.body.page = 1;
      this.fetch();
    },

    goBack() {
      this.$emit("go:back");
    },
  },
};
</script>
