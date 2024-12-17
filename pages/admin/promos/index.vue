<template>
  <div>
    <general-table-header
      label="Brand"
      actionCreate="/admin/promos/create"
      @on:sort="onSort"
      @on:search="onSearch"
      @on:export="onExport"
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
      <template v-slot:[`item.brand`]="{ item }">
        {{ item.brand.name }}
      </template>

      <template v-slot:[`item.retail`]="{ item }">
        {{ item.retail.name }}
      </template>

      <template v-slot:[`item.thumbnail`]="{ item }">
        <general-thumbnail
          ratio="1"
          :image="getImage(item.image)"
          class="my-4 d-inline-block"
        />
      </template>

      <template v-slot:[`item.expiredDate`]="{ item }">
        {{ fullDateTime(item.expiredDate, "-") }}
      </template>

      <template v-slot:[`item.isActive`]="{ item }">
        <div class="d-flex align-center pa-4">
          <v-switch
            color="success lighten-2"
            inset
            :ripple="false"
            v-model="item.isActive"
            @click="onUpdateStatus(item)"
          />
        </div>
      </template>

      <template v-slot:[`item.action`]="{ item }">
        <v-menu auto offset-x rounded="xxl">
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </span>
          </template>
          <v-list>
            <v-list-item @click="onEdit(item.id)">
              <v-list-item-title class="d-flex align-center">
                <v-icon size="16" class="mr-3 primary--text">
                  mdi-pencil
                </v-icon>
                <span class="h8--supersmall primary--text h8--supersmall"
                  >Ubah
                </span>
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="handleDialogDelete(item.id)">
              <v-list-item-title class="d-flex align-center">
                <v-icon size="16" class="mr-3 error--text"> mdi-delete </v-icon>
                <span class="h8--supersmall error--text">Hapus</span>
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

    <general-dialog-delete
      :dialog="state.dialogDelete"
      :loading="state.isLoading"
      @on:close="handleDialogDelete"
      @on:delete="onDelete()"
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
      title: "Promos",
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
      dialogDelete: false,
      selectedId: null,
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
        text: "Photo",
        value: "thumbnail",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Promo Name",
        value: "name",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Brand",
        value: "brand",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },

      {
        text: "Retail",
        value: "retail",
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
        value: "isActive",
        sortable: false,
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
      title: "Promos",
      child: false,
    };

    this.$store.commit("SET_META", appBar);
    this.setQuery(this.queryParams);
    this.fetch();
  },

  methods: {
    async onUpdateStatus(val) {
      const res = await this.$api.promos.update(val.id, {
        isActive: val.isActive,
      });

      if (res.success) {
        if (!val.isActive) {
          this.setFailedAlert({ message: "Promo has been deactive" });
          return;
        }
        this.setSuccessAlert("Promo has been active");
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },

    setQuery(val) {
      this.body.page = Number(val?.page) || this.body?.page;
      this.body.limit = Number(val?.limit) || this.body?.limit;
      this.body.keyword = val?.keyword;
      this.body.sort = val?.sort || "desc";
    },

    async fetch() {
      this.state.isLoading = true;

      const res = await this.$api.promos.getList({ ...this.body });

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

    handleDialogDelete(id) {
      if (id) {
        this.state.selectedId = id;
      }

      this.state.dialogDelete = !this.state.dialogDelete;
    },

    async onDelete() {
      this.state.isLoading = true;
      const id = this.state.selectedId;

      const res = await this.$api.promos.delete(id);

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

    onSearch(val) {
      this.body.keyword = val || "";
      this.body.page = 1;
      this.fetch();
      this.pushQuery("keyword", val);
    },

    onFilterCandidate(val) {
      this.body.target = [val];
      this.fetch();
      this.pushQuery("target", val);
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

    onEdit(id) {
      this.$router.push(`/admin/promos/${id}`);
    },

    onExport() {
      const token = this.$store.getters["auth/isToken"];

      const url = this.$api.reports.export("promos", this.body, token);
      window.open(url);
    },
  },
};
</script>
