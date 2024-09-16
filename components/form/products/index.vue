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
      label="Name"
      outlined
      bold
      :rules="[required]"
    />

    <general-form-autocomplete
      v-model="form.brandId"
      label="Brands"
      :items="brands"
      item-text="name"
      item-value="id"
      outlined
      required
      bold
      :rules="[required]"
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
    brands: Array,
  },

  methods: {
    onRemoveFile() {
      this.form.image = "";
    },
  },
};
</script>
