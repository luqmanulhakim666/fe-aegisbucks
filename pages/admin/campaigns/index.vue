<template>
  <div>
    <general-table-header
      sort
      actionCreate="/admin/campaigns/create"
      @on:search="onSearch"
    />

    <v-data-table
      :headers="headers"
      :items="items.campaigns"
      :loading="state.isLoading"
      hide-default-footer
      no-data-text="No Data"
      class="mt-4 mb-6"
    >
      <template v-slot:[`item.budget`]="{ item }">
        {{ decimal(item.budget) }}
      </template>

      <template v-slot:[`item.flightDate`]="{ item }">
        {{ fullDateTime(item.expiredDate, "-") }}
      </template>

      <template v-slot:[`item.createdAt`]="{ item }">
        {{ fullDateTime(item.createdAt, "-") }}
      </template>

      <template v-slot:[`item.publishedAt`]="{ item }">
        {{ fullDateTime(item.publishedAt, "-") }}
      </template>

      <template v-slot:[`item.published`]="{ item }">
        <div class="d-flex align-center pa-4">
          <v-switch
            color="success lighten-2"
            inset
            :ripple="false"
            v-model="item.published"
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
                @click="onAction(menu.key, item)"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon
                    size="14"
                    :color="
                      menu.key === 'edit'
                        ? 'primary '
                        : menu.key === 'delete'
                        ? 'error '
                        : 'dark'
                    "
                    >{{ menu.icon }}</v-icon
                  >
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    :class="[
                      menu.key === 'edit'
                        ? 'primary--text '
                        : menu.key === 'delete'
                        ? 'error--text'
                        : 'dark--text',
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
import utils from "@/mixins/utils";
import pipe from "@/mixins/pipe";

export default {
  mixins: [meta, routes, utils, pipe],
  middleware: ["authenticated", "authorized"],
  meta: {
    page: "admin",
  },

  data: () => ({
    meta: {
      title: "Campaigns",
    },

    body: {
      page: 1,
      limit: 10,
      keyword: "",
    },

    state: {
      isLoading: false,
      isDeleteDialog: false,
      campaignId: null,
    },

    headers: [
      {
        text: "No",
        value: "no",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Campaign Name",
        value: "name",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Brand",
        value: "brand.name",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Budget",
        value: "budget",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Expired Date",
        value: "flightDate",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Created Date",
        value: "createdAt",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Published Date",
        value: "publishedAt",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Status",
        value: "published",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
      {
        text: "Action",
        value: "action",
        align: "center",
        sortable: false,
        class: "dark--text h7--xxsmall ",
      },
    ],

    items: {
      campaigns: [],
      actions: [
        {
          key: "open",
          text: "Open Web",
          icon: "mdi-web",
        },
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
      }
    },

    async onUpdateStatus(val) {
      const res = await this.$api.campaigns.publish(val.id, {
        publish: val.published,
      });

      if (res.success) {
        if (!val.published) {
          this.setFailedAlert({ message: "Campaign has been deactive" });
          return;
        }
        this.setSuccessAlert("Campaign has been active");
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }
    },
    async fetch() {
      this.state.isLoading = true;

      const res = await this.$api.campaigns.getList({ ...this.body });

      if (res.success) {
        this.items.campaigns = res.data.list?.map((x, index) => ({
          no: (this.body.page - 1) * this.body.limit + index + 1,
          ...x,
        }));
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

    onSearch(val) {
      this.body.keyword = val || "";
      this.body.page = 1;
      this.fetch();
      this.pushQuery("keyword", val);
    },

    onChangeRole(val) {
      this.body.role = val;
      this.body.page = 1;
      this.body.keyword = "";
      this.fetch();
      this.pushQuery("role", val);
    },

    onChangePagination(val) {
      this.body.page = val;
      this.fetch();
    },

    onAction(key, val) {
      switch (key) {
        case "delete":
          this.state.isDeleteDialog = true;
          this.state.campaignId = val.id;
          break;

        case "open":
          let url = "";
          const host = this.$config.API_URL.replace("/api", "");
          if (!val.published) {
            url = `${host}/campaign/${val.brand.slug}/${val.slug}?__preview=true`;
          }

          if (val.published) {
            url = `${host}/campaign/${val.brand.slug}/${val.slug}`;
          }

          window.open(url);
          break;

        default:
          this.$router.push(`/admin/campaigns/${val.id}`);
          break;
      }
    },

    onCloseDialog() {
      this.state.isDeleteDialog = false;
    },

    async onDelete() {
      this.state.isLoading = true;

      const res = await this.$api.campaigns.delete(this.state.campaignId);

      if (res.success) {
        this.fetch();
        this.setSuccessAlert("Data has been deleted");
        this.onCloseDialog();
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    preventDelete(val) {
      const id = this.$store.getters["auth/profile"]["id"];
      return id !== val;
    },
  },
};
</script>
