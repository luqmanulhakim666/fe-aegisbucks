<template>
  <div>
    <general-form-image-cropper
      class="mb-6"
      :form="form"
      bold
      required
      label="Logo"
      acceptFile="image/png, image/jpg, image/jpeg"
      @on:remove="onRemoveFile()"
    />

    <general-form-text-field
      required
      v-model="form.name"
      label="Name"
      outlined
      bold
      :rules="[required]"
    />

    <general-form-autocomplete
      v-model="form.categoryId"
      label="Merchant Category"
      :items="categories"
      item-text="name"
      item-value="id"
      outlined
      required
      bold
      :rules="[required]"
      :loading="loadingCategories"
      @keydown="onFetchCategories"
    />

    <general-form-text-field
      required
      v-model="form.phone"
      label="Phone"
      outlined
      bold
      @keypress="onDigits"
      :rules="[required, number]"
    />

    <general-form-text-field
      required
      v-model="form.pic"
      label="PIC"
      outlined
      bold
      :rules="[required]"
    />

    <general-form-text-field
      required
      v-model="form.agreementNumber"
      label="Agreement Number"
      outlined
      bold
      @keypress="onDigits"
      :rules="[required, number]"
    />

    <general-form-date-picker
      required
      v-model="form.agreementDate"
      :dateValue="form.agreementDate"
      label="Agreement Date"
      formatDateText="DD MMM YYYY"
      bold
      :rules="[required]"
    />

    <general-form-text-area
      class="mt-6"
      v-model="form.address"
      label="Address"
      outlined
      bold
    />
    <general-form-text-area
      v-model="form.description"
      label="Description"
      outlined
      bold
    />
    <general-form-autocomplete
      label="Kota"
      bold
      required
      v-model="form.cityId"
      className="text-capitalize"
      outlined
      hide-details="auto"
      :items="regencies"
      item-text="name"
      item-value="id"
      :loading="loadingRegencies"
      :rules="[required]"
      @keydown="onFetchRegencies"
    />
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";
import debounce from "lodash/debounce";

export default {
  mixins: [rules, utils],
  props: {
    form: Object,
    regencies: Array,
    loadingRegencies: Boolean,
    categories: Array,
    loadingCategories: Boolean,
  },

  computed: {
    minDate() {
      let date = new Date();
      return this.$dayjs(date).format("YYYY-MM-DD");
    },
  },

  methods: {
    onFetchRegencies: debounce(function (val) {
      const keyword = val.target._value;
      this.$emit("fetch:regencies", keyword);
    }, 500),

    onFetchCategories: debounce(function (val) {
      const keyword = val.target._value;
      this.$emit("fetch:categories", keyword);
    }, 500),

    onRemoveFile() {
      this.form.image = "";
      this.form.imageId = "";
    },
  },
};
</script>
