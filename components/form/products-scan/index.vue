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

    <general-form-text-field
      required
      v-model="form.reward"
      label="Point"
      outlined
      bold
      :rules="[required]"
      @keypress="onDigits"
    />

    <general-form-text-field
      required
      v-model="form.timeSpent"
      label="Time Spent (In Minute)"
      outlined
      bold
      :rules="[required, number]"
      @keypress="onDigits"
    />

    <div class="mb-6">
      <p class="h6--xsmall label-text dark--text">Variants</p>
      <v-btn
        depressed
        small
        class="h8--supersmall primary text-capitalize mt-4"
        @click="onAddVariant()"
        >+ Add Variant</v-btn
      >
      <div v-for="(item, index) in form.variants" :key="index" class="d-flex">
        <general-form-text-field
          class="full-width"
          v-model="item['name']"
          required
          outlined
          hide-details
          bold
        />
        <v-btn
          @click="onRemoveItem(index)"
          class="error--text ml-2 mt-2"
          icon
          small
          ><v-icon>mdi-close-circle</v-icon></v-btn
        >
      </div>
    </div>

    <general-form-text-area
      v-model="form.description"
      label="Description"
      outlined
      bold
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
    onRemoveItem(index) {
      this.form.variants.splice(index, 1);
    },

    onAddVariant() {
      this.form.variants.push({ name: "" });
    },

    onRemoveFile() {
      this.form.image = "";
    },
  },
};
</script>
