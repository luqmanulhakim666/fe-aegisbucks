<template>
  <div>
    <p class="text-center h6--xsmall mt-6">Pilih Lokasi Penukaran Voucher</p>

    <general-form-text-field
      hide-details="auto"
      dense
      class="hide-input mt-2 mb-4"
      v-model="form.retailId"
      :rules="[required]"
    />

    <v-radio-group
      class="mt-0"
      hide-details
      v-model="form.retailId"
      :rules="[required]"
    >
      <v-radio
        v-for="(item, index) in retailPartners"
        :key="index"
        :ripple="false"
        :value="item.id"
        class="mb-6"
      >
        <template v-slot:label>
          <img
            v-if="isRetailType"
            width="80"
            class="pointer"
            :src="getImage(item.image)"
            alt="img"
          />

          <v-icon v-if="!isRetailType" color="dark"> mdi-store </v-icon>
          <span class="ml-4 text--default">{{ item.name }}</span>
        </template>
      </v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import media from "@/mixins/media";
export default {
  mixins: [media, rules],
  props: {
    retailPartners: Array,
    isRetailType: Boolean,
    form: Object,
  },

  methods: {
    onEmitSelect(id) {
      this.$emit("on:select", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.retail_card {
  border: 1px solid transparent;
  &-active {
    border: 1px solid var(--v-primary-base);
  }
}
::v-deep .hide-input {
  .v-input__slot {
    display: none !important;
  }
  input {
    display: none !important;
  }
}
</style>
