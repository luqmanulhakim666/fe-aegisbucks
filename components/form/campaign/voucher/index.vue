<template>
  <div>
    <template v-if="state.detailMode">
      <form-campaign-voucher-detail
        :campaignId="$route.params.slug"
        :voucherId="state.selectedItem.id"
        :voucherName="`Voucher ${state.selectedItem.retail.name} ${state.selectedItem.campaignProduct.product.name}`"
        @go:back="onGoToDetail"
      />
    </template>

    <template v-if="!state.detailMode">
      <v-form class="white pa-6 rounded-xl" v-model="state.isValid" ref="form">
        <v-btn
          depressed
          class="secondary lighten-5 h7--xxsmall text-capitalize"
          x-small
          @click="handleDialog"
        >
          <v-icon class="mr-2" size="14">mdi-plus</v-icon>
          Add Voucher
        </v-btn>

        <p class="h6--xsmall mt-6 dark--text text--lighten-5">
          Voucher Partners
        </p>

        <general-form-text-field
          class="hide-input mb-2"
          hide-details="auto"
          dense
          v-model="items.vouchers"
          :rules="[arrayRule]"
        />

        <v-data-table
          :headers="headers"
          :loading="state.isLoading"
          :items="items.vouchers"
          hide-default-footer
          no-data-text="No Data"
          class="mt-2 border-thin"
        >
          <template v-slot:[`item.voucherName`]="{ item }">
            Voucher {{ item.retail.name }}
            {{ item.campaignProduct.product.name }}
          </template>

          <template v-slot:[`item.totalCode`]="{ item }">
            {{ decimal(item.totalCode) }}
          </template>

          <template v-slot:[`item.limit`]="{ item }">
            {{ decimal(item.limit) }}
          </template>

          <template v-slot:[`item.expiredDate`]="{ item }">
            {{ fullDateTime(item.expiredDate, "-") }}
          </template>

          <template v-slot:[`item.normalPrice`]="{ item }">
            {{ decimal(item.normalPrice) }}
          </template>

          <template v-slot:[`item.discount`]="{ item }">
            {{ decimal(item.discount) }}
          </template>

          <template v-slot:[`item.description`]="{ item }">
            {{ item.productId.description }}
          </template>

          <template v-slot:[`item.action`]="{ item, index }">
            <v-menu auto offset-x rounded="xxl">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </span>
              </template>
              <v-list>
                <v-list-item @click="handleDialog(item, index)">
                  <v-list-item-title class="d-flex align-center">
                    <v-icon size="16" class="mr-3 primary--text">
                      mdi-pencil
                    </v-icon>
                    <span class="h8--supersmall primary--text h8--supersmall"
                      >Edit
                    </span>
                  </v-list-item-title>
                </v-list-item>

                <v-list-item @click="handleDialogDelete(item, index)">
                  <v-list-item-title class="d-flex align-center">
                    <v-icon size="16" class="mr-3 error--text">
                      mdi-delete
                    </v-icon>
                    <span class="h8--supersmall error--text">Delete</span>
                  </v-list-item-title>
                </v-list-item>

                <v-list-item @click="onGoToDetail(item)">
                  <v-list-item-title class="d-flex align-center">
                    <v-icon size="16" class="mr-3 dark--text"> mdi-eye </v-icon>
                    <span class="h8--supersmall dark--text h8--supersmall"
                      >Detail
                    </span>
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
      </v-form>

      <div class="d-flex justify-end mt-8">
        <v-btn
          @click="goBack()"
          class="primary-create-btn text-capitalize h7--xxsmall"
          depressed
          outlined
          :disabled="state.isLoading"
        >
          Previous
        </v-btn>

        <v-btn
          :loading="state.isLoading"
          class="secondary lighten-5 text-capitalize ml-2 h7--xxsmall"
          depressed
          @click="onSubmit()"
        >
          Save
          <v-icon small class="ml-2">mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </template>

    <general-dialog-delete
      :dialog="state.dialogDelete"
      @on:close="handleDialogDelete"
      @on:delete="onDelete()"
    />

    <dialog-campaign-voucher
      :dialog="state.dialog"
      :item="state.selectedItem"
      :partners="partners"
      :products="products"
      :isEdited="state.isEdited"
      @on:fetch="fetchVouchers"
      @on:close="state.dialog = false"
    />
  </div>
</template>

<script>
import media from "@/mixins/media";
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";
import pipe from "@/mixins/pipe";
export default {
  props: {
    form: Object,
    partners: Array,
    products: Array,
  },
  mixins: [media, rules, utils, pipe],
  middleware: ["authenticated", "authorized"],
  meta: {
    page: "admin",
  },
  data: () => ({
    body: {
      page: 1,
      limit: 10,
    },
    paging: {},
    headers: [
      {
        text: "No",
        value: "no",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Partner",
        value: "retail.name",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Voucher Name",
        value: "voucherName",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Product",
        value: "campaignProduct.product.name",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Limit per User",
        value: "limit",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Total Voucher",
        value: "totalCode",
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
        text: "Action",
        value: "action",
        align: "center",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
    ],
    meta: {
      title: "",
    },

    state: {
      isLoading: false,
      fetchLoading: false,
      dialog: false,
      dialogDelete: false,
      selectedItem: {},
      selectedIndex: null,
      isEdited: false,
      detailMode: false,
      voucher: {},
    },
    items: {
      vouchers: [],
    },
  }),

  created() {
    if (!this.isCreated) {
      this.fetchVouchers();
    }
  },

  methods: {
    async fetchVouchers() {
      const id = this.$route.params.slug;
      this.state.fetchLoading = true;

      const res = await this.$api.campaigns.voucher.getList(id, {
        ...this.body,
      });

      if (res.success) {
        this.items.vouchers = res.data.list?.map((x, index) => ({
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

    handleDialog(val, index) {
      if (val?.productId) {
        this.state.selectedItem = val;
        this.state.selectedIndex = index;
      }

      this.state.isEdited = !!val?.productId;
      this.state.dialog = !this.state.dialog;
    },

    onGoToDetail(val, index) {
      if (val?.id) {
        this.state.selectedItem = val;
        this.state.selectedIndex = index;
      }

      this.state.detailMode = !this.state.detailMode;
    },

    onChangePagination(val) {
      this.body.page = val;
      this.fetchVouchers();
    },

    onSubmit() {
      this.$router.push({
        path: `/admin/campaigns/${this.$route.params.slug}`,
        query: { tab: "templates" },
      });
    },

    handleDialogDelete(val, index) {
      if (val?.productId) {
        this.state.selectedItem = val;
        this.state.selectedIndex = index;
      }
      this.state.dialogDelete = !this.state.dialogDelete;
    },

    async onDelete() {
      this.state.isLoading = true;

      const res = await this.$api.campaigns.voucher.delete(
        this.$route.params.slug,
        this.state.selectedItem?.id
      );

      if (res.success) {
        this.items.vouchers.splice(this.state.selectedIndex, 1);
        this.setSuccessAlert("Voucher has been removed");
        this.state.dialogDelete = false;
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
      this.state.selectedIndex = null;
    },

    goBack() {
      this.$router.push({
        path: `/admin/campaigns/${this.$route.params.slug}`,
        query: { tab: "products" },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .hide-input {
  .v-input__slot {
    display: none !important;
  }
  input {
    display: none !important;
  }
}
</style>
