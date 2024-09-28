<template>
  <div>
    <template v-if="!state.formMode">
      <v-form class="white pa-6 rounded-xl" v-model="state.isValid" ref="form">
        <v-btn
          depressed
          class="secondary lighten-5 h7--xxsmall text-capitalize"
          x-small
          @click="handleDialog"
        >
          <v-icon class="mr-2" size="14">mdi-plus</v-icon>
          Add Product
        </v-btn>

        <general-form-text-field
          hide-details="auto"
          dense
          class="hide-input mt-2 mb-4"
          v-model="items.selectedProducts"
          :rules="[arrayRule]"
        />

        <v-data-table
          :headers="headers"
          :loading="state.isLoading"
          :items="items.selectedProducts"
          hide-default-footer
          no-data-text="No Data"
          class="mt-4 border-thin"
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

          <template v-slot:[`item.price`]="{ item }">
            {{ decimal(item.price) }}
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

                <v-list-item @click="handleFormMode(item, index)">
                  <v-list-item-title class="d-flex align-center">
                    <v-icon size="16" class="mr-3 dark--text">
                      mdi-file-document-outline
                    </v-icon>
                    <span class="h8--supersmall dark--text h8--supersmall"
                      >Form
                    </span>
                  </v-list-item-title>
                </v-list-item>

                <v-list-item @click="handleDialogDelete(index)">
                  <v-list-item-title class="d-flex align-center">
                    <v-icon size="16" class="mr-3 error--text">
                      mdi-delete
                    </v-icon>
                    <span class="h8--supersmall error--text">Hapus</span>
                  </v-list-item-title>
                </v-list-item>
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

      <dialog-campaign-product
        :dialog="state.dialog"
        :item="state.selectedItem"
        :products="products"
        :selectedProducts="items.selectedProducts"
        :isEdited="state.isEdited"
        @on:submitProduct="onSubmitProduct"
        @on:close="state.dialog = false"
      />
    </template>

    <template v-if="state.formMode">
      <form-campaign
        :campaignSlug="form.slug"
        :brandSlug="form.brand.slug"
        @go:back="handleFormMode"
        @save:form="onSaveForm"
        :item="state.selectedItem"
      />
    </template>
  </div>
</template>

<script>
import media from "@/mixins/media";
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";
export default {
  props: {
    loading: Boolean,
    form: Object,
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
        text: "Photo",
        value: "thumbnail",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Product Name",
        value: "name",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Limit Claim",
        value: "limitClaim",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Campaign Type",
        value: "type",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Normal Price",
        value: "price",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Discount (Subsidy Budget)",
        value: "discount",
        sortable: false,
        class: "dark--text h7--xxsmall",
      },
      {
        text: "Description",
        value: "description",
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
      dialog: false,
      dialogDelete: false,
      selectedItem: {},
      selectedIndex: null,
      dialogForm: false,
      isEdited: false,
      formMode: false,
      hasFetched: false,
    },
    items: {
      selectedProducts: [],
    },
  }),

  created() {
    const route = this.$router.history._startLocation;

    if (route === "/admin/campaigns/create") {
      this.$emit("get:detail", this.$route.params.slug);
      return true;
    }

    this.state.hasFetched = true;
    if (!this.isCreated) {
      this.items.selectedProducts = this.form.campaignProducts.map((x) => {
        return {
          ...x,
          productId: {
            ...x.product,
          },
        };
      });
    }
  },

  methods: {
    async fetchOne() {
      const route = this.$router.history._startLocation;

      if (route === "/admin/campaigns/create") {
        this.$emit("get:detail", this.$route.params.slug);
      }
    },

    onSaveForm(val) {
      this.items.selectedProducts[this.state.selectedIndex]["inputs"] = val;
    },

    handleFormMode(val, index) {
      if (val?.productId?.id) {
        this.state.selectedItem = val;
      }
      this.state.selectedIndex = index;
      this.state.formMode = !this.state.formMode;
    },
    handleDialogForm() {
      this.state.dialogForm = !this.state.dialogForm;
    },

    handleDialog(val, index) {
      if (val?.productId) {
        this.state.selectedItem = val;
        this.state.selectedIndex = index;
      }

      this.state.isEdited = !!val?.productId;
      this.state.dialog = !this.state.dialog;
    },

    async onSubmit() {
      const valid = await this.validate(this.state.isValid);

      if (this.items.selectedProducts?.length === 0) {
        this.setFailedAlert({ message: "at Least add one product" });
      }

      if (!valid) return;

      this.state.isLoading = true;

      const payload = {
        name: this.form.name,
        campaignProducts: this.items.selectedProducts?.map((x) => {
          const data = { ...x, productId: x.productId?.id };

          if (data.inputs?.length === 0) {
            delete data.inputs;
          }

          return data;
        }),
      };

      const res = await this.$api.campaigns.update(
        this.$route.params.slug,
        payload
      );

      if (res.success) {
        this.form.campaignProducts = payload.campaignProducts;

        this.$router.push({
          path: `/admin/campaigns/${this.$route.params.slug}`,
          query: { tab: "vouchers" },
        });
      }

      if (!res.success) {
        this.setFailedAlert(res);
      }

      this.state.isLoading = false;
    },

    onSubmitProduct(val) {
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
      this.setSuccessAlert("Product has been removed");
    },

    goBack() {
      this.$router.push({ query: { tab: "general" } });
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
