<template>
  <div>
    <general-table-header
      label="Brand"
      actionCreate="/admin/products-scan/create"
      @on:sort="onSort"
      @on:search="onSearch"
      :exportReport="false"
      sort
    />

    <v-data-table
      :headers="headers"
      :loading="state.isLoading"
      :items="items"
      hide-default-footer
      no-data-text="No Data"
      class="mt-4"
    >
      <template v-slot:[`item.no`]="{ item }">
        <p class="dark--text">{{ item.no }}</p>
      </template>

      <template v-slot:[`item.name`]="{ item }">
        <p class="dark--text">{{ item.productScan.name }}</p>
      </template>

      <template v-slot:[`item.thumbnail`]="{ item }">
        <general-thumbnail
          ratio="1"
          :image="getImage(item.productScan.image)"
          class="my-4 d-inline-block"
        />
      </template>

      <template v-slot:[`item.createdAt`]="{ item }">
        {{ fullDateTime(item.createdAt, "-") }}
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-card
          flat
          width="100"
          class="pa-2 rounded-xl text-center h8--supersmall"
          v-bind:class="{
            'success lighten-1 dark--text': item.status === 'approved',
            'primary lighten-2 white--text': item.status === 'pending',
            'error lighten-2 white--text': item.status === 'rejected',
          }"
        >
          <p class="text-capitalize">
            {{ item.status }}
          </p>
        </v-card>
      </template>

      <template v-slot:[`item.action`]="{ item }">
        <p
          @click="handleDialogVerify(item)"
          depressed
          class="text-default primary--text hover-underline"
        >
          Details
        </p>
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

    <dialog-verify-point
      :dialog="state.isDialog"
      :item="state.selectedItem"
      :loading="state.submitLoading"
      @on:submit="onSubmit"
      @on:close="handleDialogVerify()"
    />
  </div>
</template>

<script>
import media from "@/mixins/media";
import routes from "@/mixins/routes";
import meta from "@/mixins/meta";
import pipe from "@/mixins/pipe";

export default {
  mixins: [media, routes, meta, pipe],
  middleware: ["authenticated", "authorized"],
  meta: {
    page: "admin",
  },
  data: () => ({
    meta: {
      title: "Verify Point",
    },
    body: {
      page: 1,
      limit: 10,
      keyword: "",
      sort: "asc",
    },
    paging: {},
    state: {
      isLoading: false,
      submitLoading: false,
      isDialog: false,
      selectedItem: {},
    },
    items: [],
    headers: [
      {
        text: "No",
        value: "no",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Name",
        value: "name",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Image",
        value: "thumbnail",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Points",
        value: "reward",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Claim Date",
        value: "createdAt",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Status",
        value: "status",
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Aksi",
        value: "action",
        align: "center",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
    ],
  }),

  created() {
    let appBar = {
      title: "Verify Point",
      child: false,
    };

    this.$store.commit("SET_META", appBar);
    this.setQuery(this.queryParams);
    this.fetch();
  },

  methods: {
    async onSubmit(status, reason) {
      this.state.submitLoading = true;

      const body = {
        approve: status === "approved",
        reason: reason,
      };
      const id = this.state.selectedItem?.id;
      const res = await this.$api.userScan.verify(id, body);

      if (res.success) {
        this.setSuccessAlert("Data has been updated");
        this.fetch();
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.submitLoading = false;
    },

    handleDialogVerify(val) {
      console.log("w", val);
      if (val?.id) {
        this.state.selectedItem = val;
      }

      this.state.isDialog = !this.state.isDialog;
    },

    setQuery(val) {
      this.body.page = Number(val?.page) || this.body?.page;
      this.body.limit = Number(val?.limit) || this.body?.limit;
      this.body.keyword = val?.keyword;
      this.body.sort = val?.sort || "desc";
    },

    async fetch() {
      this.state.isLoading = true;

      const res = await this.$api.products.scan.getListVerifyPoint({
        ...this.body,
      });

      if (res.success) {
        this.items = res.data.list?.map((x, index) => ({
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

      this.state.isLoading = false;
    },

    onSearch(val) {
      this.body.keyword = val || "";
      this.body.page = 1;
      this.fetch();
      this.pushQuery("keyword", val);
    },

    onSort(val) {
      this.body.sort = [val];
      this.fetch();
      this.pushQuery("sort", val);
    },

    onChangePagination(val) {
      this.body.page = val;
      this.fetch();
      this.pushQuery("page", val);
    },
  },
};
</script>
