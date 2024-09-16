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
  </div>
</template>

<script>
import rules from "@/mixins/rules";
export default {
  mixins: [rules],
  props: {
    form: Object,
  },

  computed: {
    minDate() {
      let date = new Date();
      return this.$dayjs(date).format("YYYY-MM-DD");
    },
  },

  methods: {
    onRemoveFile() {
      this.form.image = "";
      this.form.imageId = "";
    },
  },
};
</script>
