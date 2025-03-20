<template>
  <div>
    <template v-if="totalPage">
      <div class="d-sm-flex justify-space-between align-center">
        <p v-if="pagingData" class="text--default dark--text">
          Menampilkan {{ decimal(pagingData) }} -
          {{ paging.next ? paging.limit * paging.page : total }}
          dari {{ decimal(total) }} data
        </p>

        <v-pagination
          class="mt-6 mt-sm-0"
          color="secondary lighten-5"
          v-model="paging.page"
          :length="totalPage"
          :total-visible="5"
          @input="onEmitChange"
        />
      </div>
    </template>

    <template v-if="!totalPage">
      <div class="h4--defaul text-center mt-14">
        <h4>Tidak ada data</h4>
      </div>
    </template>
  </div>
</template>
<script>
import utils from "@/mixins/utils";
export default {
  mixins: [utils],
  props: {
    perPage: [Number, String],
    total: Number,
    totalPage: Number,
    paging: Object,
  },

  computed: {
    pagingData() {
      return this.paging.limit * this.paging.page - (this.paging.limit - 1);
    },
  },

  methods: {
    onEmitChange(val) {
      this.$emit("on:change", val);
    },
  },
};
</script>
