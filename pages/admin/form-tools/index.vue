<template>
  <div>
    <general-table-header
      placeholder="Cari form ..."
      :createDialog="true"
      :filterCandidate="filters.filterCandidate"
      defaultLabelFilter="Filter Target"
      @on:filterCandidate="onFilterCandidate"
      @on:search="onSearch"
      @on:dialog="handleDialog()"
    />
    <v-data-table
      :headers="headers"
      :loading="state.isLoading"
      :items="items"
      hide-default-footer
      no-data-text="No Data"
      class="mt-8"
    >
      <template v-slot:[`item.target`]="{ item }">
        <v-card flat max-width="150">
          <general-user-tag :target="handleTargetForm(item)" class="py-4" />
        </v-card>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-menu auto offset-x rounded="xxl">
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </span>
          </template>
          <v-list>
            <v-list-item @click="onDetail(item.id)">
              <v-list-item-title class="d-flex align-center">
                <v-icon size="16" class="mr-3 dark--text"> mdi-eye </v-icon>
                <span class="text--small">Detail </span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="onDuplicate(item.id)">
              <v-list-item-title class="d-flex align-center">
                <v-icon size="16" class="mr-3 dark--text">
                  mdi-content-copy
                </v-icon>
                <span class="text--small">Duplikasi</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="handleDialogDelete(item.id)">
              <v-list-item-title class="d-flex align-center">
                <v-icon size="16" class="mr-3 dark--text"> mdi-delete </v-icon>
                <span class="text--small dark--text">Hapus</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
    <dialog-form-tools :dialog="state.isDialog" @on:close="handleDialog" />
    <general-dialog-delete
      :dialog="state.dialogDelete"
      @on:close="handleDialogDelete"
      @on:delete="onDelete()"
    />
  </div>
</template>

<script>
import alert from "@/mixins/alert";
import routes from "@/mixins/routes";
import debounce from "lodash/debounce";

export default {
  middleware: ["authenticated", "authorized"],
  meta: {
    page: ["admin"],
    permission: ["super_admin"],
  },
  mixins: [alert, routes],
  data: () => ({
    items: [],
    filters: {
      filterCandidate: [
        { key: "", name: "Semua" },
        { key: "incubator_form", name: "Inkubator" },
        { key: "tenant_form", name: "Tenant" },
      ],
    },
    body: {
      page: 1,
      limit: 10,
      keyword: "",
      type: "",
    },
    paging: {},
    headers: [
      {
        text: "No",
        value: "no",
        sortable: false,
        align: "center",
        class: "dark--text h7--xxsmall dark lighten-2 text-center",
      },
      {
        text: "Nama Form",
        value: "name",
        sortable: false,
        width: 500,
        class: "dark--text h7--xxsmall dark lighten-2 ",
      },
      {
        text: "Target",
        value: "target",
        sortable: false,
        class: "dark--text h7--xxsmall dark lighten-2",
      },
      {
        text: "Aksi",
        value: "action",
        align: "center",
        sortable: false,
        class: "dark--text h7--xxsmall dark lighten-2",
      },
    ],
    state: {
      isLoading: false,
      isDialog: false,
      dialogDelete: false,
      selectedId: null,
    },
  }),

  created() {
    let meta = {
      title: "Form Tool",
      child: false,
    };

    this.$store.commit("SET_META", meta);

    this.setQuery(this.queryParams);

    this.fetch();
  },

  methods: {
    setQuery(val) {
      this.body.page = Number(val?.page) || this.body.page;
      this.body.limit = Number(val?.limit) || this.body.limit;
      this.body.keyword = val?.keyword || "";
      this.body.type = val?.type || "";
    },

    async fetch() {
      // get list form
      this.state.isLoading = true;

      let res = await this.$api.dynamicForm.getList({ ...this.body });

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

    onSearch: debounce(function (val) {
      this.body.keyword = val || "";
      this.body.page = 1;
      this.fetch();
      this.pushQuery("keyword", val);
    }, 500),

    onFilterCandidate(val) {
      this.body.type = val;
      this.fetch();
      this.pushQuery("type", val);
    },

    onChangePagination(val) {
      this.body.page = val;
      this.fetch();
      this.pushQuery("page", val);
    },

    async onDuplicate(id) {
      this.state.isLoading = true;

      const res = await this.$api.dynamicForm.duplicate(id);

      if (res.success) {
        this.setSuccessAlert("Berhasil duplikasi data");
        this.fetch();
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    async onDelete() {
      this.state.isLoading = true;
      const id = this.state.selectedId;

      const res = await this.$api.dynamicForm.delete(id);

      if (res.success) {
        this.state.dialogDelete = false;
        this.setSuccessAlert("Berhasil menghapus data");
        this.fetch();
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    handleDialogDelete(id) {
      if (id) {
        this.state.selectedId = id;
      }

      this.state.dialogDelete = !this.state.dialogDelete;
    },

    handleTargetForm(val) {
      if (val.type === "incubator_form") {
        return "incubator";
      }

      return "tenant";
    },

    handleDialog() {
      this.state.isDialog = !this.state.isDialog;
    },

    onDetail(id) {
      this.$router.push(`/admin/form-tools/${id}`);
    },
  },
};
</script>
