<template>
  <v-dialog v-model="dialog" persistent width="500" v-if="dialog" scrollable>
    <v-card flat class="white rounded-xl">
      <general-card-dialog-header
        :name="item.productScan.name"
        @close="onEmitClose()"
      />

      <v-card-text class="pa-6">
        <v-expansion-panels
          den
          flat
          class="mb-4 border-thin rounded-lg"
          focusable
        >
          <v-expansion-panel>
            <v-expansion-panel-header class="grey lighten-3">
              <span class="h6--xsmall">
                <v-icon small color="dark">mdi-account</v-icon>
                User Information</span
              >
            </v-expansion-panel-header>
            <v-expansion-panel-content class="my-4">
              <p class="h7--xxsmall dark--text">Name</p>
              <p class="text--default dark--text">
                {{ item.user.name }}
              </p>

              <v-divider class="my-4" />
              <p class="h7--xxsmall dark--text">Email</p>

              <p class="text--default dark--text">
                {{ item.user.email }}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <div>
          <p class="h7--xxsmall dark--text text-center mb-4">
            Bukti Upload Struk:
          </p>
          <div class="d-flex mx-auto justify-center">
            <v-img
              :lazy-src="`${getImage(item)}?auto=format,compress&w=50`"
              max-height="300"
              contain
              :src="getImage(item)"
            />
          </div>
        </div>

        <div class="d-flex justify-center mt-4">
          <a
            class="pa-2 rounded-xl text-center h8--supersmall d-inline-block v-card v-card--flat v-sheet theme--light success lighten-1 success--text"
            :href="`${getImage(item)}`"
            target="_blank"
          >
            <v-icon color="success">mdi-magnify</v-icon>
            Perbesar
          </a>
        </div>

        <template v-if="result">
          <div class="d-flex align-start justify-start mt-6">
            <v-icon small class="mr-2">mdi-store</v-icon>
            <p class="text--default">Retail Name:{{ result?.retailName }}</p>
          </div>

          <div class="d-flex align-start justify-start mt-2">
            <v-icon small class="mr-2">mdi-pin</v-icon>
            <p class="text--default">Address: {{ result?.address }}</p>
          </div>

          <div class="d-flex align-start justify-start mt-2">
            <v-icon small class="mr-2">mdi-clock</v-icon>
            <p class="text--default">Date Time: {{ result?.dateTime }}</p>
          </div>

          <div class="d-flex align-start justify-start mt-2">
            <v-icon small class="mr-2">mdi-cash</v-icon>
            <p class="text--default">Rp {{ result?.total }}</p>
          </div>

          <div v-if="result?.items" class="mt-4">
            <v-data-table
              :headers="headers"
              :items="result.items"
              hide-default-footer
              class="shadow-small overflow-hidden"
            >
              <template v-slot:[`item.no`]="{ index }">
                {{ index + 1 }}
              </template>

              <!-- <template v-slot:[`item.progress`]="{ item }">
              <general-okr-progress
                :progress="item.objectiveKeyResultProgress"
              />
            </template> -->
            </v-data-table>
          </div>
        </template>
        <v-divider class="my-8" />

        <template v-if="item.status === 'pending'">
          <general-form-text-field
            outlined
            label="Retail Name"
            bold
            v-model="form.retailName"
          />

          <general-form-text-area
            outlined
            label="Address"
            bold
            v-model="form.address"
          />
          <general-form-text-field
            outlined
            label="Product Name"
            bold
            v-model="form.productName"
          />
          <general-form-text-field
            outlined
            label="Quantity"
            bold
            v-model="form.qty"
          />
          <general-form-text-field
            outlined
            label="Price"
            bold
            v-model="form.price"
          />
          <general-form-text-field
            outlined
            label="Total Price"
            bold
            v-model="form.totalPrice"
          />
          <general-form-date-picker
            v-model="form.transactionDate"
            :dateValue="form.transactionDate"
            :max="maxDate"
            class="mb-6"
            outlined
            bold
            label="Date"
          />
          <general-form-text-area
            outlined
            label="Comment"
            bold
            optional
            v-model="form.reason"
          />

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-btn
                block
                small
                depressed
                class="error lighten-1 text-capitalize h7--xxsmall"
                @status="onSubmit(reject)"
                :loading="loading"
              >
                Reject
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                block
                small
                depressed
                class="primary lighten-1 text-capitalize h7--xxsmall"
                :loading="loading"
                @click="onSubmit('approved')"
              >
                Approve
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import media from "@/mixins/media";
import pipe from "@/mixins/pipe";
import { result } from "lodash";
export default {
  mixins: [media, pipe],
  props: {
    dialog: Boolean,
    item: Object,
    loading: Boolean,
  },

  data: () => ({
    headers: [
      {
        text: "No",
        value: "no",
        sortable: false,
      },
      {
        text: "Product Name",
        value: "name",
        sortable: false,
      },
      {
        text: "Qty",
        value: "qty",
        sortable: false,
      },
      {
        text: "Price",
        value: "price",
        sortable: false,
      },
      {
        text: "Total",
        value: "totalPrice",
        sortable: false,
      },
    ],
    form: {
      reason: "",
      retailName: "",
      address: "",
      productName: "",
      qty: 0,
      price: 0,
      totalPrice: 0,
      transactionDate: "",
    },
  }),

  computed: {
    maxDate() {
      let date = new Date();
      return this.$dayjs(date).format("YYYY-MM-DD");
    },
    products() {
      return this.item.productS;
    },

    result() {
      if (!this.item.text) return;

      // Normalize the text by replacing multiple spaces/newlines
      let text = this.item?.text
        .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
        .replace(/\n/g, " ") // Replace newlines with spaces
        .trim();

      return {
        retailName:
          text
            .match(
              /^(?:PT\.?|Alfamidi|Alfamidiku|Toko|Alfamart|Indomaret|Superindo|Giant|Hypermart|Carrefour|.*?Mart|.*?Store)[^\d\n]+/i
            )?.[0]
            ?.trim() || null, // Extracts store name before digits

        address:
          text.match(/Jl\.?.+?,?\s?\d+/i)?.[0]?.trim() ||
          text.match(/(RT|RW|Kel\.)[\s\S]+?\d+/i)?.[0]?.trim() ||
          null, // Extracts address variations

        dateTime:
          text.match(/\d{2}[-\/]\d{2}[-\/]\d{4}\s\d{2}:\d{2}:\d{2}/)?.[0] ||
          text.match(/\d{2}\.\d{2}\.\d{2}-\d{2}:\d{2}/)?.[0] ||
          text.match(/\d{2}-\d{2}-\d{4} \d{2}:\d{2}/)?.[0] ||
          null, // Extracts date-time in multiple formats

        items: [
          ...text.matchAll(
            /([A-Za-z0-9\s\.\-]+(?: [A-Za-z0-9]+){0,})\s+(\d+)\s+([\d,]+)\s+([\d,]+)/g
          ),
        ] // Extracts all items
          .map((m) => ({
            name: m[1].trim(), // Extracts item name
            qty: parseInt(m[2]), // Extracts quantity
            price: parseFloat(m[3].replace(/,/g, "")), // Extracts price per item
            totalPrice: parseFloat(m[4].replace(/,/g, "")), // Extracts total price per item
          })),

        total:
          text.match(
            /Total\s(?:Belanja|Iten|Tagihan)?\s?:?\s?([\d,]+)/i
          )?.[1] || null, // Extracts total price

        cash: text.match(/Tunai\s?:?\s?([\d,]+)/i)?.[1] || null, // Extracts cash paid

        change: text.match(/Kembali\s?:?\s?([\d,]+)/i)?.[1] || null, // Extracts change

        discount:
          text.match(
            /(?:Total Disc\.|VOUCHER|Pot BIKP).*?:?\s?\(?([\d,]+)/i
          )?.[1] || "0", // Extracts discount

        tax:
          text.match(/PPN\s?(?:DPP)?:?.*?([\d,]+)/i)?.[1] ||
          text.match(/PPN\s?:?.*?([\d,]+)/i)?.[1] ||
          null, // Extracts PPN (Tax)

        npwp:
          text.match(
            /NPWP\s?:?\s?(\d{2}\.\d{3}\.\d{3}\.\d-\d{3}\.\d{3})/
          )?.[1] || null, // Extracts NPWP
      };
    },
  },

  methods: {
    async onSubmit(status) {
      await this.$emit("on:submit", status, this.form);
      this.onEmitClose();
    },

    onEmitClose() {
      this.form.reason = "";
      this.form.retailName = "";
      this.form.address = "";
      this.form.productName = "";
      this.form.qty = 0;
      this.form.price = 0;
      this.form.totalPrice = 0;
      this.form.transactionDate = "";

      this.$emit("on:close");
    },
  },
  watch: {
    "form.qty"(val) {
      if (val) {
        this.form.qty = this.decimal(val);
      }
    },
    "form.price"(val) {
      if (val) {
        this.form.price = this.decimal(val);
      }
    },
    "form.totalPrice"(val) {
      if (val) {
        this.form.totalPrice = this.decimal(val);
      }
    },

    dialog(val) {
      if (val && result) {
        this.form.retailName = this.result?.retailName;
        this.form.address = this.result?.address;
        this.form.productName = this.result?.productName;
        this.form.retailName = this.result?.retailName;
      }
    },
  },
};
</script>
