<template>
  <v-dialog v-model="dialog" persistent max-width="600" scrollable>
    <v-card flat class="white rounded-xl modal-content">
      <general-card-dialog-header
        class="modal-header"
        name="Product"
        @close="onEmitClose"
      />

      <v-card-text class="pa-6">
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

          <general-form-text-area
            v-model="form.promoLabel"
            label="Promo Label"
            outlined
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

          <v-expansion-panels
            flat
            class="mb-4 border-thin rounded-lg"
            focusable
          >
            <v-expansion-panel>
              <v-expansion-panel-header class="grey lighten-3">
                <span class="h6--xsmall">Custom Email Template</span>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="mt-4">
                <v-switch
                  label="Enabled"
                  inset
                  :ripple="false"
                  v-model="form.isCustomEmailTemplate"
                >
                  <template v-slot:label>
                    <p class="h6--xsmall">
                      {{ form.isCustomEmailTemplate ? "Enabled" : "Disabled" }}
                    </p>
                  </template>
                </v-switch>

                <div
                  class="border-thin pa-4 rounded-xl mb-6"
                  v-if="form.isCustomEmailTemplate"
                >
                  <v-row dense>
                    <v-col
                      cols="auto"
                      v-for="(button, index) in buttons"
                      :key="index"
                    >
                      <v-btn
                        small
                        depressed
                        class="text-capitalize h7--xxsmall rounded-pill primary lighten-2"
                        @click="onAddText(button.key)"
                      >
                        {{ button.label }}
                      </v-btn>
                    </v-col>

                    <v-col cols="auto" v-if="campaign.type === 'merchant'">
                      <v-btn
                        small
                        depressed
                        class="text-capitalize h7--xxsmall rounded-pill primary lighten-2"
                        @click="onAddText('{{merchantCategoryName}}')"
                      >
                        Merchant
                      </v-btn>
                    </v-col>

                    <v-col cols="auto" v-if="campaign.type === 'merchant'">
                      <v-btn
                        small
                        depressed
                        class="text-capitalize h7--xxsmall rounded-pill primary lighten-2"
                        @click="onAddText('{{merchantCityName}}')"
                      >
                        Kota
                      </v-btn>
                    </v-col>
                  </v-row>

                  <client-only>
                    <quill-editor
                      class="my-4"
                      ref="editor"
                      :options="editorOption"
                      v-model="form.customEmailTemplate"
                    />
                  </client-only>

                  <v-expansion-panels
                    flat
                    class="mb-4 border-thin rounded-lg"
                    focusable
                  >
                    <v-expansion-panel>
                      <v-expansion-panel-header class="grey lighten-3">
                        <span class="h6--xsmall">Email Preview</span>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="my-6">
                        <span v-html="formattedTemplate"></span>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <div class="d-flex justify-end mt-8">
            <v-btn
              class="primary lighten-5 text-capitalize ml-2 h7--xxsmall"
              depressed
              @click="onEmitSubmitProduct()"
            >
              Submit
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";
import media from "@/mixins/media";

export default {
  mixins: [rules, utils, media],
  props: {
    campaign: Object,
    item: Object,
    dialog: Boolean,
    products: Array,
    selectedProducts: Array,
    isEdited: Boolean,
  },

  data: () => ({
    editorOption: {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          ["link"],
          [
            { align: "" },
            { align: "center" },
            { align: "right" },
            { align: "justify" },
          ],
        ],
      },
    },
    state: {
      isValid: false,
      oldProductId: null,
    },
    form: {
      type: "free",
      promoLabel: "",
      customEmailTemplate: "",
      isCustomEmailTemplate: true,
      productId: {},
      limitClaim: null,
      price: null,
      discount: null,
      inputs: [],
    },
    buttons: [
      {
        label: "Nama",
        key: "{{userName}}",
      },
      {
        label: "Email",
        key: "{{userEmail}}",
      },
      {
        label: "Usage Instruction",
        key: "{{usageInstruction}}",
      },
      {
        label: "Product Name",
        key: "{{productName}}",
      },
      {
        label: "Brand Logo",
        key: "<img style='width:100px' src={{brandLogo}} />",
      },
      {
        label: "Brand Name",
        key: "{{brandName}}",
      },
      {
        label: "Promo Label",
        key: "{{promoLabel}}",
      },
      {
        label: "Header Image",
        key: "<img style='width:100%; height: auto; display: flex; margin: auto;' src={{headerImage}} />",
      },
      {
        label: "Campaign Name",
        key: "{{campaignName}}",
      },
      {
        label: "Expired Date",
        key: "{{expiredDate}}",
      },
      {
        label: "Voucher Code",
        key: `<div class="voucher-code"><p>{{voucherCode}}</p></div>`,
      },
      {
        label: "voucherBarcode",
        key: "<img style='width:200px; display: flex;margin: auto; justify-content: center;' src={{voucherBarcode}} />",
      },
      {
        label: "Retail Name",
        key: "{{retailName}}",
      },
    ],
  }),

  computed: {
    formattedTemplate() {
      let dummyData = {
        userName: "John Doe",
        userEmail: "johndoe@gmail.com",
        voucherBarcode: "./images/dummy/barcode.png",
        productName: this.form.productId?.name,
        headerImage: this.getImage({ id: this.campaign?.emailHeaderImageId }),
        brandLogo: this.getImage({ id: this.campaign?.brand?.logoId }),
        brandName: this.campaign.brand?.name,
        promoLabel: this.form.promoLabel,
        campaignName: this.campaign.name,
        expiredDate: "25-Jan-2025 23:59:59",
        usageInstruction:
          "<ol><li>Kunjungi<strong>&nbsp;</strong><strong>Toko</strong></li><li>Ambil&nbsp;<strong>Product</strong></li><li>Saat di kasir, beritahu kasir bahwa Anda punya kode voucher</li><li>Kasir akan scan&nbsp;<strong>Product</strong>&nbsp;dan kemudian&nbsp;scan barcode / input kode voucher Anda</li></ol>",
        voucherCode: "CODE001",
        retailName: "Toko",
        merchantCategoryName: "Merchant A",
        merchantCityName: "Jakarta",
      };

      // Create a copy of the original customEmailTemplate
      let template = this.form.customEmailTemplate;

      // Properly format and replace the {{brandLogo}} placeholder
      template = template?.replace(/\{\{(.*?)\}\}/g, (match, p1) => {
        // Replace with corresponding dummy data if available, or keep as is if no dummy data is found
        return dummyData[p1?.trim()] || match;
      });

      // Convert &lt; and &gt; to < and > to render HTML tags properly
      template = template?.replace(/&lt;/g, "<")?.replace(/&gt;/g, ">");

      // Return the modified template
      return this.replaceAlignClass(template);
    },
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
    replaceAlignClass(htmlContent) {
      return htmlContent?.replace(
        /class="ql-align-center"/g,
        'class="text-center"'
      );
    },
    onEmitClose() {
      this.$emit("on:close");
    },

    onAddText(val) {
      const quill = this.$refs.editor?.quill;
      const selection = quill.getSelection();

      if (selection) {
        const cursorPosition = selection.index;

        quill.insertText(cursorPosition, val);

        quill.setSelection(cursorPosition + val.length);
      }
    },

    async onEmitSubmitProduct() {
      const valid = await this.validate(this.state.isValid);

      if (valid) {
        this.form.limitClaim = this.toInt(this.form.limitClaim);
        this.form.price = this.toInt(this.form.price);
        this.form.discount = this.toInt(this.form.discount);

        this.form.customEmailTemplate = this.form.customEmailTemplate
          ?.replace(/&lt;/g, "<")
          ?.replace(/&gt;/g, ">");

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
      this.form.promoLabel = "";
      this.form.customEmailTemplate = "";
      this.form.productId = {};
      this.form.limitClaim = null;
      this.form.isCustomEmailTemplate = false;
      this.form.price = null;
      this.form.discount = null;
      this.form.inputs = [];
      this.$refs.form.resetValidation();
    },
  },

  watch: {
    async dialog(val) {
      if (this.campaign.type === "merchant") {
        const findRetailIndex = this.buttons?.findIndex((x) => {
          return x.key === "{{retailName}}";
        });

        if (findRetailIndex >= 0) {
          this.buttons?.splice(findRetailIndex, 1);
        }
      }
      if (val && this.item?.productId) {
        this.form = JSON.parse(JSON.stringify(this.item));
      }

      if ((await val) && !this.isEdited) {
        this.onClearForm();
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

<style lang="scss" scoped>
* {
  left: 0 !important;
}

.quill-editor {
  overflow-y: auto;
}

::v-deep .ql-toolbar.ql-snow {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

::v-deep .ql-container.ql-snow {
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

::v-deep .ql-editor {
  height: 200px;
  max-height: 100%;
}

::v-deep .ql-tooltip {
  left: 5px !important;
}
</style>
