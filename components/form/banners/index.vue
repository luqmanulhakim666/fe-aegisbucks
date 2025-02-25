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

    <div class="mb-6">
      <p class="h6--xsmall label-text dark--text">Status</p>
      <v-switch label="Status" inset :ripple="false" v-model="form.isActive">
        <template v-slot:label>
          <p class="h6--xsmall">
            {{ form.isActive ? "Active" : "Inactive" }}
          </p>
        </template>
      </v-switch>
    </div>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import utils from "@/mixins/utils";

export default {
  mixins: [rules, utils],
  props: {
    form: Object,
  },

  methods: {
    onRemoveFile() {
      this.form.image = "";
    },
  },
};
</script>
