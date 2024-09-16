<template>
  <div>
    <general-breadcrumbs :lists="items.breadcrumbs" class="mb-10" />

    <div
      class="d-flex align-center justify-space-between mb-6"
      v-if="!isEmptyPage"
    >
      <div class="d-flex align-center">
        <template v-if="!state.isRename">
          <h2 class="h2--xsmall primary--text">
            {{ page.name }}
          </h2>
          <v-btn depressed plain @click="onEdit()"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
        </template>

        <template v-if="state.isRename">
          <div class="d-flex align-center">
            <general-form-text-field
              v-model="page.name"
              class="mr-2"
              className="transparent"
            />
            <v-btn color="error" depressed icon @click="onCancelRename()"
              ><v-icon small>mdi-close</v-icon></v-btn
            >
            <v-btn depressed color="success" icon @click="onRename()"
              ><v-icon small>mdi-check</v-icon></v-btn
            >
          </div>
        </template>
      </div>

      <!-- <h2 class="h2--xsmall dark--text text--lighten-5">
        {{ page.type === 'incubator_form' ? 'Inkubator' : 'Tenant' }}
      </h2> -->
    </div>

    <div class="my-6">
      <h4 class="h4--default mb-2">Target</h4>
      <general-form-select
        v-model="state.target"
        class="white rounded-lg"
        :items="items.target"
        item-text="label"
        item-value="key"
        outlined
        hide-details="auto"
        @change="onChangeTarget"
      />
    </div>

    <general-empty-state
      v-if="isEmptyPage"
      title="Halaman Belum Dibuat"
      description="Buat Halaman untuk memilah pertanyaan"
      action
      @on:action="handleDialogCreatePage()"
    />

    <div v-if="!isEmptyPage">
      <form-tools-card
        class="mb-8"
        v-for="(item, index) in page.pages"
        :key="index"
        :item="item"
        :indexPage="index"
        :iSDialogDeleteOpened="state.isDeleteDialog"
        @on:add="handleAddFieldDialog(index)"
        @on:delete="onDeleteField"
        @delete:page="handleDialogDelete"
        @on:submit="onHandleActionField"
        @on:order="onReOrder"
      />

      <v-btn
        depressed
        class="primary-create-btn"
        @click="handleDialogCreatePage()"
      >
        Buat Halaman
      </v-btn>
    </div>

    <general-dialog-delete
      :dialog="state.isDeleteDialog"
      :loading="state.isLoadingDelete"
      @on:close="handleDialogDelete"
      @on:delete="onDeletePage"
    />

    <dialog-form-tools-field
      :dialog="state.isDialog"
      :indexPage="state.selectedIndex"
      :loading="state.isLoadingDelete"
      @on:submit="onHandleActionField"
      @on:close="handleAddFieldDialog()"
    />
    <dialog-form-tools-create-page
      :dialog="state.isDialogCreatePage"
      :loading="state.isLoadingDelete"
      @on:submit="onCreatePage"
      @on:close="handleDialogCreatePage()"
    />
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
    meta: {
      title: 'Form Tool'
    },
    state: {
      isLoading: false,
      isLoadingDelete: false,
      isLoadingCreatePage: false,
      isDeleteDialog: false,
      isDialog: false,
      isDialogCreatePage: false,
      selectedIndex: '',
      id: null,
      isRename: false,
      oldName: '',
      target: null
    },
    page: {},
    items: {
      breadcrumbs: [
        { text: 'Form', slug: '/admin/form-tools' },
        { text: 'Form Tool', slug: '' }
      ],
      target: [
        { key: 'incubator_form', label: 'Inkubator' },
        { key: 'tenant_form', label: 'Tenant' }
      ]
    }
  }),

  created() {
    this.state.id = this.$route.params?.slug
    this.fetch()
  },

  mounted() {
    let meta = {
      title: 'Form Tool',
      child: true
    }
    this.$store.commit('SET_META', meta)
  },

  computed: {
    isEmptyPage() {
      return !this.page?.pages?.length
    }
  },

  methods: {
    onChangeTarget(val) {
      this.page.type = val
      this.onReOrder()
    },
    handleDialogCreatePage() {
      this.state.isDialogCreatePage = !this.state.isDialogCreatePage
    },

    onEdit() {
      let oldName = JSON.parse(JSON.stringify(this.page))
      this.state.oldName = oldName['name']
      this.state.isRename = true
    },

    onRename() {
      this.onReOrder()
      this.items.breadcrumbs[1]['text'] = this.page?.name
      this.state.isRename = false
    },

    onCancelRename() {
      this.page['name'] = this.state.oldName
      this.state.isRename = false
    },
    async fetch() {
      this.state.isLoading = true
      let res = await this.$api.dynamicForm.getOne(this.state.id)

      if (res.success) {
        this.page = res.data
        this.items.breadcrumbs[1]['text'] = res?.data?.name
        this.state.target = res.data?.type
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.state.isLoading = false
    },

    handleAddFieldDialog(index) {
      this.state.selectedIndex = index
      this.state.isDialog = !this.state.isDialog
    },

    async onReOrder() {
      let payload = {
        name: this.page?.name,
        pages: this.page?.pages,
        type: this.page?.type
      }

      await this.$api.dynamicForm.update(this.state.id, payload)
    },

    async onHandleActionField(action, form, indexPage, indexField) {
      let payload = {
        name: this.page?.name,
        pages: this.page?.pages,
        type: this.page?.type
      }

      if (action === 'create') {
        let newField = {
          label: form?.label,
          type: form?.type,
          required: form?.required,
          options: form.options,
          note: form.note,
          acceptFiles: form?.acceptFiles,
          isCopyDocument: form?.isCopyDocument,
          isAddress: form?.isAddress,
          isName: form?.isName
        }

        if (!form?.options?.length) {
          delete newField['options']
        }

        if (form.type !== 'file') {
          delete newField['acceptFiles']
          delete newField['isCopyDocument']
        }

        payload['pages'][indexPage]['fields'].push(newField)
      }

      if (action === 'edit') {
        if (form.type !== 'file') {
          form['acceptFiles'] = null
          form['isCopyDocument'] = null
        }
        let field = form

        payload['pages'][indexPage]['fields'][indexField] = field
      }

      if (action === 'delete') {
        payload = form
      }

      let res = await this.$api.dynamicForm.update(this.state.id, payload)

      if (res.success) {
        let label =
          action === 'create'
            ? 'menambah'
            : action === 'edit'
            ? 'mengubah'
            : 'menghapus'

        this.setSuccessAlert(`Berhasil ${label} field`)
        this.fetch()
      }

      if (!res.success) {
        this.setFailedAlert(res)
        this.page.pages[indexPage]['fields'].pop()
      }
    },

    async onCreatePage(pageName) {
      this.state.isLoadingCreatePage = true

      let payload = {
        name: this.page?.name,
        pages: this.page?.pages,
        type: this.page?.type
      }

      let newPage = {
        name: pageName,
        fields: []
      }

      payload['pages'].push(newPage)

      let res = await this.$api.dynamicForm.update(this.state.id, payload)

      if (res.success) {
        this.setSuccessAlert('Berhasil membuat halaman baru')
        this.state.isDialogCreatePage = false
      }

      if (!res.success) {
        this.setFailedAlert(res)
        this.page.pages.pop()
      }

      this.state.isLoadingCreatePage = false
    },

    onDeleteField(indexPage, indexField) {
      let field = this.page?.pages[indexPage]['fields']
      field?.splice(indexField, 1)
      this.onHandleActionField('delete', this.page, indexPage, indexField)
    },

    handleDialogDelete(indexPage) {
      this.state.isDeleteDialog = !this.state.isDeleteDialog
      this.state.selectedIndex = indexPage
    },

    async onDeletePage() {
      let index = this.state.selectedIndex
      this.state.isLoadingDelete = true
      let payload = {
        name: this.page?.name,
        pages: this.page?.pages,
        type: this.page?.type
      }

      payload['pages']?.splice(index, 1)

      let res = await this.$api.dynamicForm.update(this.state.id, payload)

      if (res.success) {
        this.setSuccessAlert('Berhasil menghapus halaman')
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.fetch()
      this.state.isDeleteDialog = false
      this.state.isLoadingDelete = false
    }
  }
}
</script>
