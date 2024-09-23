<template>
  <div>
    <p class="text-center h4--default">Pilih Lokasi Penukaran Voucher</p>
    <p class="text-center">Klik Pada Logo Merchant</p>

    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="(item, index) in retailPartners"
          :key="index"
        >
          <img class="v-responsive" :src="getImage(item.image)" alt="" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import media from "@/mixins/media";
export default {
  mixins: [media],
  props: {
    retailPartners: Array,
  },
};
</script>
