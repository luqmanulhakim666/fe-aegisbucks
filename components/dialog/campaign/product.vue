<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <div class="white rounded-xl">
      <general-card-dialog-header name="Product" @close="onEmitClose" />
      <div class="pa-4">
        <v-form v-model="state.isValid" ref="form">
          <div class="">
            <div class="d-flex align-center mb-2">
              <p class="h6--xsmall label-text">Campaign Type</p>
              <p class="h6--xsmall text-capitalize label-text ml-1 error--text">
                *
              </p>
            </div>

            <v-radio-group v-model="form.type">
              <v-radio
                value="free"
                dense
                hide-details="auto"
                class="text-capitalize text--default"
              >
                <template v-slot:label>
                  <p class="text--default">Free</p>
                </template>
              </v-radio>
            </v-radio-group>
          </div>

          <general-form-autocomplete
            v-model="form.productId"
            label="Product"
            :items="availableProducts"
            item-text="name"
            outlined
            return-object
            required
            bold
            :rules="[required]"
          />

          <general-form-text-field
            required
            v-model="form.limitClaim"
            label="Limit Claim"
            outlined
            bold
            :rules="[required]"
            @keypress="onDigits"
          />

          <general-form-text-field
            required
            v-model="form.price"
            label="Normal Price"
            outlined
            bold
            :rules="[required]"
            @keypress="onDigits"
          />

          <general-form-text-field
            required
            v-model="form.discount"
            label="Discount (Subsidy Budget)"
            outlined
            bold
            :rules="[required]"
            @keypress="onDigits"
          />

          <div class="d-flex justify-end mt-8">
            <v-btn
              class="secondary lighten-5 text-capitalize ml-2 h7--xxsmall"
              depressed
              @click="onEmitSubmitProduct()"
            >
              Submit
            </v-btn>
          </div>
        </v-form>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";

export default {
  mixins: [rules, utils],
  props: {
    item: Object,
    dialog: Boolean,
    products: Array,
    selectedProducts: Array,
    isEdited: Boolean,
  },

  data: () => ({
    state: {
      isValid: false,
      oldProductId: null,
    },
    form: {
      type: "free",
      productId: {},
      limitClaim: null,
      price: null,
      discount: null,
      inputs: [],
    },
  }),

  computed: {
    availableProducts() {
      let products = [];

      for (let i in this.products) {
        const id = this.products[i]["id"];
        const index = this.selectedProducts?.findIndex((x) => {
          return x.productId?.id === id;
        });

        if (index < 0) {
          products.push(this.products[i]);
        }
      }

      if (this.isEdited) {
        products.push(this.item.productId);
      }
      return products;
    },
  },

  methods: {
    onEmitClose() {
      this.$emit("on:close");
    },

    async onEmitSubmitProduct() {
      const valid = await this.validate(this.state.isValid);

      if (valid) {
        this.form.limitClaim = this.toInt(this.form.limitClaim);
        this.form.price = this.toInt(this.form.price);
        this.form.discount = this.toInt(this.form.discount);
        this.$emit("on:submitProduct", JSON.parse(JSON.stringify(this.form)));
        this.setSuccessAlert(
          this.isEdited ? "Product has been updated" : "Product has been added"
        );
        this.onClearForm();
        this.onEmitClose();
      }
    },

    onClearForm() {
      this.form.type = "free";
      this.form.productId = {};
      this.form.limitClaim = null;
      this.form.price = null;
      this.form.discount = null;
      this.form.inputs = [];
      this.$refs.form.resetValidation();
    },
  },

  watch: {
    async dialog(val) {
      if (val && this.item?.productId) {
        this.form = JSON.parse(JSON.stringify(this.item));
      }

      if ((await val) && !this.isEdited) {
        this.form.type = "free";
        this.form.productId = {};
        this.form.limitClaim = null;
        this.form.price = null;
        this.form.discount = null;
        this.form.inputs = [];
        this.$refs.form.resetValidation();
      }
    },
    "form.limitClaim"(val) {
      if (val) {
        this.form.limitClaim = this.decimal(val);
      }
    },
    "form.price"(val) {
      if (val) {
        this.form.price = this.decimal(val);
      }
    },
    "form.discount"(val) {
      if (val) {
        this.form.discount = this.decimal(val);
      }
    },
  },
};
</script>
