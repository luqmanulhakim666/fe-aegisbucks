<template>
  <div>
    <general-breadcrumbs :lists="items.breadcrumbs" class="mb-6" />
    <template v-if="!isDetail">
      <form-assessment-parameters
        :form="form"
        :loading="state.isLoading"
        @on:save="onSave"
        @on:back="onGoBack"
      />
    </template>

    <template v-if="isDetail">
      <div class="d-flex justify-space-between align-center">
        <p class="h5--small">Parameter Keterangan Penilaian</p>
        <v-btn
          icon
          class="h7--xxsmall secondary lighten-5 text-capitalize"
          depressed
          @click="handleDialog"
        >
          <v-icon color="white" small>mdi-plus</v-icon>
        </v-btn>
      </div>

      <v-data-table
        :headers="headers"
        :loading="state.isLoading"
        :items="items.list"
        hide-default-footer
        no-data-text="No Data"
        class="mt-8"
      >
        <template v-slot:[`item.percentage`]="{ item }">
          {{ item.percentage }}%
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-menu auto offset-x rounded="xxl">
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </span>
            </template>
            <v-list>
              <v-list-item @click="handleDialog(item)">
                <v-list-item-title class="d-flex align-center">
                  <v-icon size="16" class="mr-3 dark--text">
                    mdi-pencil
                  </v-icon>
                  <span class="text--small">Ubah</span>
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="handleDialogDelete(item)">
                <v-list-item-title class="d-flex align-center">
                  <v-icon size="16" class="mr-3 dark--text">
                    mdi-delete
                  </v-icon>
                  <span class="text--small dark--text">Hapus</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>

      <general-dialog-delete
        :dialog="state.isDeleteDialog"
        :loading="state.isLoading"
        @on:close="handleDialogDelete"
        @on:delete="onDelete"
      />

      <dialog-assessment-parameters
        :dialog="state.isDialog"
        :form="form"
        :item="state.selectedItem"
        @on:close="handleDialog"
        @on:save="onSave"
      />
    </template>
  </div>
</template>

<script>
import meta from '@/mixins/meta'
import alert from '@/mixins/alert'

export default {
  middleware: ['authenticated', 'authorized'],
  mixins: [meta, alert],
  meta: {
    page: ['admin'],
    permission: ['super_admin']
  },
  data: () => ({
    form: {
      code: '',
      title: '',
      percentage: '',
      year: '',
      parent: null
    },
    body: {
      skip: 1,
      limit: 10,
      keyword: '',
      sort: 'oldest'
    },
    paging: {},
    headers: [
      {
        text: 'No',
        value: 'no',
        sortable: false,
        align: 'center',
        class: 'dark--text h7--xxsmall dark lighten-2 text-center'
      },
      {
        text: 'Code',
        value: 'code',
        sortable: false,
        align: 'center',
        class: 'dark--text h7--xxsmall dark lighten-2 text-center'
      },
      {
        text: 'Nama Keterangan Penilaian',
        value: 'title',
        sortable: false,
        align: 'left',
        class: 'dark--text h7--xxsmall dark lighten-2 '
      },

      {
        text: 'Aksi',
        value: 'action',
        align: 'center',
        sortable: false,
        class: 'dark--text h7--xxsmall dark lighten-2'
      }
    ],
    meta: {
      title: 'Parameter Aspek Penilaian'
    },
    state: {
      isLoading: false,
      isDialog: false,
      isDeleteDialog: false,
      selectedItem: {}
    },
    items: {
      list: [],
      breadcrumbs: [
        {
          text: 'Parameter Aspek Penilaian',
          slug: '/admin/assessment/parameters'
        },
        { text: 'Buat Parameter Aspek Penilaian', slug: '' }
      ]
    }
  }),

  created() {
    if (!this.isCreated && !this.isDetail) {
      this.fetchOne()
    }

    if (this.isDetail) {
      this.form.parent = this.$route?.params?.slug
      this.fetch()
    }
  },

  mounted() {
    let meta = {
      title: 'Parameter Aspek Penilaian',
      child: true
    }
    this.$store.commit('SET_META', meta)
  },

  computed: {
    isCreated() {
      return this.$route?.params?.slug === 'create'
    },

    isDetail() {
      return this.$route?.query?.detail
    },

    id() {
      return this.$route?.params?.slug
    }
  },

  methods: {
    async fetch() {
      // get list form
      this.state.isLoading = true
      this.body.skip = Number(this.body.skip)
      this.body.limit = Number(this.body.limit)
      this.body.parent = this.$route?.params?.slug

      let res = await this.$api.assessment.label.getList({ ...this.body })

      if (res.success) {
        this.items.list = res.data.list?.map((x, index) => ({
          no: (this.body.skip - 1) * this.body.limit + index + 1,
          ...x
        }))
        this.paging = res.data.paging
        this.paging['totalPage'] = Math.ceil(
          this.paging?.count / this.body.limit
        )

        // this.$router.push({ query: { ...this.body } })
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.state.isLoading = false
    },
    async fetchOne() {
      this.state.isLoading = true

      let res = await this.$api.assessment.label.getOne(this.id)

      if (res.success) {
        this.form = res.data
        this.items.breadcrumbs[1]['text'] = res.data?.title
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.state.isLoading = false
    },

    async onSave(action) {
      this.state.isLoading = true

      let payload = {
        code: this.form.code,
        title: this.form.title,
        percentage: Number(this.form.percentage),
        parent: this.form.parent?.id ? this.form.parent?.id : this.form.parent,
        year: this.form.parent?.id ? this.form?.parent?.year : this.form.year
      }

      if (this.isDetail) {
        delete payload['year']
      }

      if (!this.form?.parent) {
        delete payload['parent']
      }

      if (this.form?.parent) {
        payload['percentage'] = Number(0)
      }

      if (this.isDetail) {
        payload['percentage'] = 0
      }

      let res = null

      if (this.isCreated && !this.isDetail) {
        res = await this.$api.assessment.label.create(payload)
      }

      if (!this.isCreated && !this.isDetail) {
        res = await this.$api.assessment.label.update(this.id, payload)
      }

      if (this.isDetail && action === 'create') {
        res = await this.$api.assessment.label.create(payload)
      }

      if (this.isDetail && action === 'update') {
        res = await this.$api.assessment.label.update(this.form?.id, payload)
      }

      let label = this.isCreated
        ? 'Berhasil Membuat Aspek Penilaian'
        : 'Berhasil Mengubah Aspek Penilaian'

      if (res.success) {
        this.setSuccessAlert(label)
        if (this.isDetail) {
          this.fetch()
          this.state.isDialog = false
          this.form['code'] = ''
          this.form['title'] = ''
        }
        if (!this.isDetail) {
          this.$router.push('/admin/assessment/parameters')
        }
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }
      this.state.isLoading = false
    },

    handleDialogDelete(item) {
      if (item?.id) {
        this.state.selectedItem = JSON.parse(JSON.stringify(item))
      }

      this.state.isDeleteDialog = !this.state.isDeleteDialog
    },

    handleDialog(item) {
      if (item?.id) {
        this.form = JSON.parse(JSON.stringify(item))
      }

      this.state.isDialog = !this.state.isDialog
    },

    async onDelete() {
      this.state.isLoading = true

      let id = this.state.selectedItem?.id

      let res = await this.$api.assessment.label.deleteLabel(id)

      if (res.success) {
        this.setSuccessAlert('Berhasil Menghapus Data')
        this.fetch()
        this.state.isDeleteDialog = false
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }
    },

    onGoBack() {
      this.$router.push('/admin/assessment/parameters')
    }
  }
}
</script>
