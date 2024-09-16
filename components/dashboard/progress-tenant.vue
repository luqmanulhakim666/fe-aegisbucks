<template>
  <section class="mt-6">
    <h1 class="dark--text h3--large mb-4">Progres Tenant</h1>
    <v-data-table
      :headers="headers"
      :items="items"
      hide-default-footer
      :loading="state.isLoading"
      class="shadow-small overflow-hidden"
    >
      <template v-slot:[`item.name`]="{ item }">
        {{ getTenantName(item) }}
      </template>
      <template v-slot:[`item.progress`]="{ item }">
        <general-okr-progress :progress="item.objectiveKeyResultProgress" />
      </template>
    </v-data-table>

    <general-pagination
      class="mt-6"
      :perPage="body.limit"
      :total="paging.count"
      :totalPage="paging.totalPage"
      :paging="paging"
      @on:change="onChangePagination"
    />
  </section>
</template>

<script>
import alert from '@/mixins/alert'
export default {
  mixins: [alert],
  data: () => ({
    paging: {},
    body: {
      skip: 1,
      limit: 10
    },
    state: {
      isLoading: false
    },
    headers: [
      {
        text: 'No',
        value: 'no',
        sortable: false
      },
      {
        text: 'Nama Tenant',
        value: 'name',
        sortable: false
      },
      {
        text: 'Progres',
        value: 'progress',
        sortable: false
      }
    ],
    items: []
  }),

  created() {
    this.fetch()
  },

  methods: {
    async fetch() {
      this.state.isLoading = true

      let payload = {
        skip: this.body.skip,
        limit: this.body.limit,
        status: 'approved_by_kadiv'
      }

      let res = await this.$api.okr.getList(payload)

      if (res.success) {
        this.items = res.data.list?.map((x, index) => ({
          no: (this.body.skip - 1) * this.body.limit + index + 1,
          ...x
        }))
        this.paging = res.data.paging
        this.paging['totalPage'] = Math.ceil(
          this.paging?.count / this.body.limit
        )
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.state.isLoading = false
    },

    onChangePagination(val) {
      this.body.skip = val
      this.fetch()
    },

    getTenantName(val) {
      return val?.formName ? val?.formName : val?.tenant?.name
    }
  }
}
</script>
