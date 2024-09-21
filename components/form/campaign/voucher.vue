<template>
  <div>
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

      <p class="h6--xsmall mt-6 dark--text text--lighten-5">Voucher Partners</p>

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
        :items="items.selectedProducts"
        hide-default-footer
        no-data-text="No Data"
        class="mt-2"
      >
        <template v-slot:[`item.no`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.thumbnail`]="{ item }">
          <general-thumbnail
            ratio="1"
            :image="getImage(item.productId)"
            class="my-4 text-center"
          />
        </template>

        <template v-slot:[`item.name`]="{ item }">
          {{ item.productId.name }}
        </template>

        <template v-slot:[`item.limitClaim`]="{ item }">
          {{ decimal(item.limitClaim) }}
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
          <div class="d-flex justify-center">
            <v-btn
              icon
              class="d-flex align-center"
              @click="handleDialog(item, index)"
            >
              <v-icon size="16" class="primary--text"> mdi-pencil </v-icon>
            </v-btn>

            <v-btn
              icon
              class="d-flex align-center"
              @click="handleDialogDelete(index)"
            >
              <v-icon size="16" class="error--text"> mdi-delete </v-icon>
            </v-btn>
          </div>
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
      @on:submitVoucher="onSubmitVoucher"
      @on:close="state.dialog = false"
    />
  </div>
</template>

<script>
import media from "@/mixins/media";
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";
export default {
  props: {
    form: Object,
    partners: Array,
    products: Array,
  },
  mixins: [media, rules, utils],
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
        text: "Partner",
        value: "partner",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Voucher Name",
        value: "name",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Products",
        value: "limitClaim",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Limit per User",
        value: "type",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Total Voucher",
        value: "normalPrice",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Expired Date",
        value: "discount",
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
    },
    items: {
      selectedProducts: [],
      vouchers: [],
    },
  }),

  created() {
    console.log("w");
    console.log(this.isCreated);
    if (!this.isCreated) {
      this.fetchVouchers();
    }
  },

  methods: {
    async fetchVouchers() {
      console.log("go");
      const id = this.$route.params.slug;
      this.state.fetchLoading = true;

      const res = await this.$api.campaigns.voucher.getList(id);

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
      console.log("ww");
    },

    onSubmitVoucher(val) {
      if (!this.state.isEdited) {
        this.items.selectedProducts.push(val);
        return;
      }

      if (this.state.isEdited) {
        this.items.selectedProducts.splice(this.state.selectedIndex, 1, val);
      }

      this.$forceUpdate();
    },

    handleDialogDelete(index) {
      if (index) {
        this.state.selectedIndex = index;
      }
      this.state.dialogDelete = !this.state.dialogDelete;
    },

    onDelete() {
      this.items.selectedProducts.splice(this.state.selectedIndex, 1);
      this.state.dialogDelete = false;
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
