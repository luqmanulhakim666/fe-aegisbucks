<template>
  <div>
    <template v-if="state.detailMode">
      <div>
        <v-btn @click="closeDetailMode()">Back</v-btn>

        <v-row>
          <v-col cols="12" md="4">
            <div class="shadow-base pa-4 rounded-xl d-inline-block white">
              <v-img
                class="rounded-xl"
                width="200"
                :src="getImage(state.voucher.campaignProduct.product)"
              />

              <p>
                {{ state.voucher.campaignProduct.product.name }}
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="8">
            <div class="white full-width d-inline-block shadow-base rounded-xl">
              <apexchart
                type="pie"
                height="350"
                :options="options"
                :series="options.series"
              />
            </div>
          </v-col>
        </v-row>
      </div>
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
          v-model="form.termCondition"
          :rules="[arrayRule]"
        />

        <v-data-table
          :headers="headers"
          :loading="state.isLoading"
          :items="items.vouchers"
          hide-default-footer
          no-data-text="No Data"
          class="mt-2"
        >
          <template v-slot:[`item.no`]="{ index }">
            {{ index + 1 }}
          </template>

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

                <!-- <v-list-item @click="onVoucherDetail(item.id)">
                  <v-list-item-title class="d-flex align-center">
                    <v-icon size="16" class="mr-3 dark--text"> mdi-eye </v-icon>
                    <span class="h8--supersmall dark--text h8--supersmall"
                      >Detail
                    </span>
                  </v-list-item-title>
                </v-list-item> -->
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
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
    options: {
      legend: {
        position: "top",
      },
      series: [],
      chart: {
        type: "pie",
      },
      labels: [],
    },
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

      const res = await this.$api.campaigns.voucher.getList(id);

      console.log(res);

      if (res.success) {
        this.items.vouchers = res.data.list;
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

    async onVoucherDetail(id) {
      const campaignId = this.$route.params.slug;
      const voucherId = id;

      const res = await this.$api.campaigns.voucher.getDetail(
        campaignId,
        voucherId
      );

      console.log("res", res);

      if (res.success) {
        this.state.voucher = res.data;
        this.options.series[0] = res.data.limit;
        this.options.series[1] = res.data.totalCode;
        this.options.labels[0] = "Limit";
        this.options.labels[1] = "Total";
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.detailMode = true;
    },

    closeDetailMode() {
      this.state.voucher = {};
      this.state.detailMode = false;
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
