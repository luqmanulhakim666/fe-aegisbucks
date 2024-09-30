<template>
  <div>
    <div class="d-md-flex align-center mb-6">
      <p class="h4--default primary--text mt-4 text--lighten-1">
        {{ label }}
      </p>
      <v-spacer />
      <general-table-header
        :isCreated="false"
        @on:search="onSearch"
        @on:export="onExport"
      />
    </div>
    <v-data-table
      :headers="headers"
      :loading="isLoading"
      :items="items"
      hide-default-footer
      no-data-text="No Data"
      class="mt-4 border-thin"
    >
      <template v-slot:[`item.deviceType`]="{ item }">
        <p class="text-capitalize">{{ item.deviceType }}</p>
      </template>

      <template v-slot:[`item.createdAt`]="{ item }">
        <p class="text-capitalize">{{ fullDateTime(item.createdAt) }}</p>
      </template>

      <template v-slot:[`item.expiredDate`]="{ item }">
        <p class="text-capitalize">{{ fullDateTime(item.expiredDate) }}</p>
      </template>

      <template v-slot:[`item.claimedDate`]="{ item }">
        <p class="text-capitalize">{{ fullDateTime(item.claimedDate) }}</p>
      </template>

      <template v-slot:[`item.claimedStatus`]="{ item }">
        <general-chips-status
          :label="item.claimed ? 'Claimed' : 'Not Claimed'"
          :color="item.claimed ? 'success lighten-2' : 'error lighten-2'"
          textColor="white--text"
          width="100"
        />
      </template>

      <template v-slot:[`item.claimed`]="{ item }">
        <p class="text-capitalize">{{ decimal(item.claimed) }}</p>
      </template>

      <template v-slot:[`item.total`]="{ item }">
        <p class="text-capitalize">{{ decimal(item.total) }}</p>
      </template>
    </v-data-table>

    <general-pagination
      v-if="paginate"
      class="mt-6"
      :perPage="body.limit"
      :total="paging.count"
      :totalPage="paging.totalPage"
      :paging="paging"
      @on:change="onChangePagination"
    />
  </div>
</template>

<script>
import pipe from "@/mixins/pipe";
export default {
  mixins: [pipe],
  props: {
    paginate: {
      type: Boolean,
      default: true,
    },
    label: String,
    items: Array,
    headers: Array,
    isLoading: Boolean,
    body: Object,
    paging: Object,
  },

  methods: {
    onChangePagination(val) {
      this.$emit("on:change", val);
    },

    onExport() {
      this.$emit("on:export");
    },

    onSearch(val) {
      this.body.page = 1;
      this.body.keyword = val;

      this.$emit("on:search");
    },
  },
};
</script>
