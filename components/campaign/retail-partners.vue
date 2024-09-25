<template>
  <div>
    <p class="text-center h5--small">Pilih Lokasi Penukaran Voucher</p>
    <p class="text-center h7--xxsmall">Klik Pada Logo Merchant</p>

    <general-form-text-field
      hide-details="auto"
      dense
      class="hide-input mt-2 mb-4 ml-4"
      v-model="form.retailId"
      :rules="[required]"
    />
    <v-container>
      <v-row>
        <v-col
          class="retail_card"
          v-bind:class="{
            'retail_card-active rounded-xl': form.retailId === item.id,
          }"
          :cols="retailPartners.length > 1 ? 6 : 12"
          v-for="(item, index) in retailPartners"
          :key="index"
        >
          <img
            class="v-responsive pointer"
            :src="getImage(item.image)"
            alt="img"
            @click="onEmitSelect(item.id)"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import rules from "@/mixins/rules";
import media from "@/mixins/media";
export default {
  mixins: [media, rules],
  props: {
    retailPartners: Array,
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
