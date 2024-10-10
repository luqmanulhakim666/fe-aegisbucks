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

    <v-data-table
      :headers="headers"
      :items="items.users"
      :loading="state.isLoading"
      hide-default-footer
      no-data-text="No Data"
      class="mt-4 mb-6"
    >
      <template v-slot:[`item.status`]="{ item }">
        <div class="d-flex align-center pa-4">
          <v-switch
            :disabled="!preventDelete(item.id)"
            color="success lighten-2"
            inset
            :ripple="false"
            v-model="item.active"
            @click="onUpdateStatus(item)"
          />
          <!-- <general-chips-status
            :label="item.active ? 'Active' : 'Inactive'"
            :color="item.active ? 'success lighten-2' : 'error lighten-2'"
            textColor="white--text"
            width="100"
          /> -->
        </div>
      </template>

      <template v-slot:[`item.action`]="{ item }">
        <v-menu offset-y rounded="lg">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              text
              rounded
              fab
              x-small
              v-bind="attrs"
              v-on="on"
              v-if="preventDelete(item.id)"
            >
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item
                v-for="(menu, i) of items.actions"
                :key="i"
                @click="onAction(menu.key, item.id)"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon
                    size="14"
                    :color="menu.key === 'edit' ? 'primary ' : 'error'"
                    >{{ menu.icon }}</v-icon
                  >
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    :class="[
                      menu.key === 'edit' ? 'primary--text ' : 'error--text',
                      'h8--supersmall',
                    ]"
                    >{{ menu.text }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

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

    headers: [
      {
        text: "Nama",
        value: "name",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Email",
        value: "email",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Status",
        value: "status",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Aksi",
        value: "action",
        align: "center",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
    ],

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

  methods: {
    setQuery(val) {
      if (val) {
        this.body.page = Number(val.page) || this.body.page;
        this.body.limit = Number(val.limit) || this.body.limit;
        this.body.keyword = val.keyword || "";
        this.body.sort = val?.sort || "desc";
        this.body.role = val.role || "admin";
        this.state.tab = val.role === "customer" ? 1 : 0;
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

    preventDelete(val) {
      const id = this.$store.getters["auth/profile"]["id"];
      return id !== val;
    },
  },
};
</script>
