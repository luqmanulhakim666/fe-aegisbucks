<template>
  <div>
    <general-table-header
      sort
      actionCreate="/admin/users/create"
      @on:search="onSearch"
      @on:export="onExport"
      @on:sort="onSort"
    />

    <v-tabs
      class="my-6"
      acr
      v-model="state.tab"
      color="primary"
      background-color="transparent"
    >
      <v-tab
        v-for="(role, index) in items.roles"
        :key="index"
        @click="onChangeRole(role.key)"
      >
        <p class="dark--text h8--supersmall text-capitalize">
          {{ role.name }}
        </p>
      </v-tab>
    </v-tabs>

    <template v-if="state.tab === 0">
      <users-admin
        :loading="state.isLoading"
        :data="items.users"
        :actions="items.actions"
        :preventDelete="preventDelete"
        @on:actions="onAction"
        @update:status="onUpdateStatus"
      />
    </template>

    <template v-if="state.tab === 1">
      <users-customer
        :loading="state.isLoading"
        :data="items.users"
        :actions="items.actions"
        :preventDelete="preventDelete"
        @on:actions="onAction"
        @update:status="onUpdateStatus"
      />
    </template>

    <template v-if="state.tab === 2">
      <users-client
        :loading="state.isLoading"
        :data="items.users"
        :actions="items.actions"
        :preventDelete="preventDelete"
        @on:actions="onAction"
        @update:status="onUpdateStatus"
      />
    </template>

    <general-dialog-delete
      :dialog="state.isDeleteDialog"
      :loading="state.isLoading"
      @on:close="onCloseDialog"
      @on:delete="onDelete"
    />
    <general-pagination
      :perPage="body.limit"
      :total="items.paging.count"
      :totalPage="items.paging.totalPage"
      :paging="items.paging"
      @on:change="onChangePagination"
    />
  </div>
</template>

<script>
import meta from "@/mixins/meta";
import routes from "@/mixins/routes";
import { ROLES } from "@/data/general";

export default {
  middleware: ["authenticated", "authorized"],
  meta: {
    page: "admin",
  },

  mixins: [meta, routes],
  data: () => ({
    meta: {
      title: "Users",
    },

    body: {
      page: 1,
      limit: 10,
      keyword: "",
      role: "admin",
      sort: "desc",
    },

    state: {
      isLoading: false,
      isDeleteDialog: false,
      tab: 0,
    },

    items: {
      users: [],
      roles: ROLES,
      actions: [
        {
          key: "edit",
          text: "Ubah",
          icon: "mdi-pencil",
        },
        {
          key: "delete",
          text: "Hapus",
          icon: "mdi-delete",
        },
      ],
      paging: {},
    },
  }),

  created() {
    this.setMeta(this.meta.title, false);
    this.setQuery(this.queryParams);

    this.fetch();
  },

  computed: {
    preventDelete() {
      const prevent = (val) => {
        const id = this.$store.getters["auth/profile"]["id"];
        return id !== val;
      };
      return prevent;
    },
  },

  methods: {
    setQuery(val) {
      if (val) {
        this.body.page = Number(val.page) || this.body.page;
        this.body.limit = Number(val.limit) || this.body.limit;
        this.body.keyword = val.keyword || "";
        this.body.sort = val?.sort || "desc";
        this.body.role = val.role || "admin";
        this.state.tab =
          val.role === "customer" ? 2 : val.role === "cust" ? 1 : 0;
      }
    },

    async onUpdateStatus(val) {
      const res = await this.$api.users.update(val.id, { active: val.active });

      if (res.success) {
        this.setSuccessAlert("Status has been changed");
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    async fetch() {
      this.state.isLoading = true;

      const res = await this.$api.users.getList({ ...this.body });

      if (res.success) {
        this.items.users = res.data.list;
        this.items.paging = res.data.paging;

        this.items.paging["totalPage"] = Math.ceil(
          this.items.paging?.count / this.body.limit
        );
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    onSort(val) {
      this.body.sort = [val];
      this.fetch();
      this.pushQuery("sort", val);
    },

    onSearch(val) {
      this.body.keyword = val || "";
      this.body.page = 1;
      this.fetch();
      this.pushQuery("keyword", val);
    },

    onChangeRole(val) {
      this.body.role = val;
      this.body.page = 1;
      this.fetch();
      this.pushQuery("role", val);
    },

    onChangePagination(val) {
      this.body.page = val;
      this.fetch();
    },

    onAction(val, id) {
      switch (val) {
        case "delete":
          this.state.isDeleteDialog = true;
          this.state.user_id = id;
          break;

        default:
          this.$router.push(`/admin/users/${id}`);
          break;
      }
    },

    onCloseDialog() {
      this.state.isDeleteDialog = false;
    },

    async onDelete() {
      this.state.isLoading = true;

      const res = await this.$api.users.delete(this.state.user_id);

      if (res.success) {
        this.fetch();
        this.setSuccessAlert("Berhasil menghapus data user");
        this.onCloseDialog();
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    onExport() {
      const token = this.$store.getters["auth/isToken"];

      const url = this.$api.reports.export("user", this.body, token);
      window.open(url);
    },

    // preventDelete(val) {
    //   console.log(val);
    //   const id = this.$store.getters["auth/profile"]["id"];
    //   return id !== val;
    // },
  },
};
</script>
