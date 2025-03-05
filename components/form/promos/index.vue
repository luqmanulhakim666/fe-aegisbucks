<template>
  <div>
    <general-form-image-cropper
      class="mb-6"
      :form="form"
      bold
      required
      label="Photo"
      acceptFile="image/png, image/jpg, image/jpeg"
      @on:remove="onRemoveFile()"
    />

    <general-form-text-field
      required
      v-model="form.name"
      label="Promo Name"
      outlined
      bold
      :rules="[required]"
    />

    <v-radio-group class="mt-0" hide-details v-model="form.hasCoupon">
      <v-radio
        v-for="i in 2"
        :key="i"
        :ripple="false"
        :value="i === 2"
        class="mb-6"
      >
        <template v-slot:label>
          <span class="ml-4 text--default">{{
            i === 1 ? "Main Offer" : "Coupon Offer"
          }}</span>
        </template>
      </v-radio>
    </v-radio-group>

    <v-checkbox
      v-model="form.isSpecial"
      dense
      :ripple="false"
      hide-details="auto"
      class="text-capitalize text--default mb-6"
    >
      <template v-slot:label>
        <p class="h6--xsmall">Special Offer This Week</p>
      </template>
    </v-checkbox>

    <general-form-autocomplete
      v-model="form.brandId"
      :loading="loadingFetchBrands"
      :items="brands"
      item-value="id"
      item-text="name"
      dense
      required
      bold
      label="Brand"
      :rules="[required]"
      outlined
      @keydown="onSelectBrand"
    />

    <general-form-autocomplete
      :disabled="!form.brandId"
      v-model="form.productId"
      :loading="loadingFetchProducts"
      :items="products"
      item-value="id"
      item-text="name"
      dense
      required
      bold
      label="Product"
      :rules="[required]"
      outlined
      @keydown="onSelectProduct"
    />

    <general-form-autocomplete
      v-model="form.retails"
      multiple
      label="Retail"
      :items="partners"
      item-text="name"
      item-value="id"
      outlined
      required
      bold
      :loading="loadingFetchPartners"
      :rules="[required]"
    />
    <!-- @keydown="onSelectPartner" -->

    <div class="mb-8">
      <div class="d-flex align-center mb-2">
        <p class="h6--xsmall label-text">Expired Date</p>
        <p class="h6--xsmall text-capitalize label-text ml-1 error--text">*</p>
      </div>
      <div class="d-flex">
        <general-form-date-picker
          v-model="form.expiredDate"
          :dateValue="form.expiredDate"
          class="mr-2"
          outlined
          :min="minDate"
          label="Date"
          :rules="[required]"
        />

        <general-form-timepicker
          v-model="form.time"
          label="Time"
          format="HH:mm:ss"
          placeholder="Waktu (WIB)"
          :rules="[required]"
        />
      </div>
    </div>

    <general-form-text-area
      v-model="form.description"
      label="Description"
      outlined
      bold
    />

    <general-form-rich-editor
      class="mb-8"
      v-model="form.howToInfo"
      label="How To"
      outlined
      bold
    />
    <general-form-rich-editor
      class="mb-8"
      required
      v-model="form.termCondition"
      label="Term and Conditions"
      outlined
      bold
    />

    <general-form-rich-editor
      class="mb-6"
      required
      v-model="form.helpInfo"
      label="Help Center"
      outlined
      bold
    />

    <general-form-rich-editor
      class="mb-8"
      required
      v-model="form.walletInfo"
      label="Wallet"
      outlined
      bold
    />

    <v-row>
      <v-col cols="12" md="4">
        <general-form-text-field
          v-model="form.ctaLabel"
          label="Call to Label"
          outlined
          bold
        />
      </v-col>
      <v-col cols="12" md="8">
        <general-form-text-field
          required
          v-model="form.ctaUrl"
          label="Call to Action"
          outlined
          bold
          :rules="[required, link]"
        />
      </v-col>
    </v-row>

    <div>
      <p class="h6--xsmall label-text">Status</p>
      <v-switch
        color="success lighten-2"
        v-model="form.isActive"
        inset
        :ripple="false"
      />
    </div>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import debounce from "lodash/debounce";

export default {
  mixins: [rules],
  props: {
    form: Object,
    brands: Array,
    partners: Array,
    products: Array,
    loadingFetchBrands: Boolean,
    loadingFetchPartners: Boolean,
    loadingFetchProducts: Boolean,
  },

  computed: {
    minDate() {
      let date = new Date();
      return this.$dayjs(date).format("YYYY-MM-DD");
    },
  },

  methods: {
    onSelectBrand: debounce(function (val) {
      const keyword = val.target._value;
      this.$emit("fetch:brand", keyword);
    }, 500),

    onSelectProduct: debounce(function (val) {
      const keyword = val.target._value;
      this.$emit("fetch:products", keyword);
    }, 500),

    onSelectPartner: debounce(function (val) {
      const keyword = val.target._value;
      this.$emit("fetch:partners", keyword);
    }, 500),

    onRemoveFile() {
      this.form.image = "";
    },
  },

  watch: {
    "form.brandId": {
      handler(oldVal, newVal) {
        if (oldVal !== newVal) {
          this.$emit("fetch:products", "");
        }
      },
      immediate: true,
    },
  },
};
</script>
