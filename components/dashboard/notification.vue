<template>
  <section class="mb-6">
    <template v-if="!state.loading.batch && !state.loading.form">
      <h1 class="dark--text h3--large mb-4">Notifikasi</h1>
      <v-card class="shadow-small rounded-xxl px-4 py-5">
        <v-card-title class="h7--xxsmall px-2 py-0 mb-4"
          >Status Pengajuan</v-card-title
        >

        <p class="h5--small pt-0 px-2">{{ progress }}</p>
        <v-card-text class="dark--text p--small px-2">
          <v-divider class="py-2" />

          <template v-if="!isHasNotRegistered">
            <template v-if="isRevised">
              <span class="font-weight-bold"
                >Revisi
                <span @click="onRevised()" class="primary--text hover-underline"
                  >dokumen</span
                >
              </span>
            </template>

            <template v-if="isDraft">
              <span class="font-weight-bold"
                >Lanjutkan
                <span
                  @click="onAssessment()"
                  class="primary--text hover-underline"
                  >pendaftaran</span
                >
              </span>
            </template>

            <template v-if="!isDraft && !isRevised">
              <p>
                Lihat
                <n-link
                  to="/incubator/my-assessment"
                  class="text-decoration-none primary--text"
                  >Status Pengajuan</n-link
                >
                Anda
              </p>
            </template>
          </template>

          <template v-if="isHasNotRegistered">
            <p>
              Pilih menu
              <n-link
                to="/incubator/registration"
                class="text-link text-decoration-none primary--text"
                >Form Pendaftaraan</n-link
              >
              untuk mengisi form dan menjadi Inkubator dari RIDI
            </p>
          </template>
        </v-card-text>

        <template v-if="isInterviewOnline">
          <v-divider />

          <v-card-title class="h7--xxsmall px-2 py-0 mb-4 mt-4"
            >Jadwal Interview</v-card-title
          >
          <general-card-interview
            :date="form.interviewDate"
            :description="form.interviewDescription"
          />
        </template>
      </v-card>

      <general-dialog-complete-registration
        title="Jadi Inkubator RIDI sekarang !"
        description="Isi form yang terserdia agar menjadi Ikubator RIDI"
        :dialog="state.dialog.registration"
        @on:close="onCloseRegistrationDialog"
        @on:register="onRegister"
      />

      <general-dialog-revised
        :dialog="state.dialog.revised"
        @on:revised="onRevised"
        @on:close="onCloseDialogRevised"
      />
    </template>
    <template v-if="state.loading.batch || state.loading.form">
      <general-skeleton-batch-list class="rounded-xl" />
    </template>
  </section>
</template>

<script>
import alert from '@/mixins/alert'
import utils from '@/mixins/utils'

export default {
  mixins: [alert, utils],
  data: () => ({
    state: {
      loading: {
        batch: false,
        form: false
      },
      dialog: {
        registration: false,
        revised: false
      }
    },
    formRaw: {},
    form: {},
    isRevised: false,
    isDraft: null
  }),

  created() {
    this.fetch()
  },

  computed: {
    isApprove() {
      return this.form.status
    },
    isHasNotRegistered() {
      return !this.form?.id
    },
    isInterviewOnline() {
      return this.form?.status === 'verification' && !!this.form?.interviewDate
    },
    progress() {
      if (!this.form?.id) {
        return 'Belum Mengajukan'
      }

      if (this.isRevised) {
        return 'Ada beberapa dokumen yang harus Anda revisi'
      }

      if (this.form?.status === 'reject') {
        return 'Pengajuan Anda tidak disetujui'
      }

      if (this.form?.status === 'administrative_selection') {
        return 'Pengajuan Anda sedang dalam proses administrasi'
      }

      if (this.form?.isDraft) {
        return 'Lanjutkan pendaftaran'
      }

      if (this.isApprove) {
        return 'Pengajuan anda selesai'
      }

      if (!this.form?.isDraft) {
        return 'Sudah mengajukan'
      }
    }
  },

  methods: {
    async fetch() {
      // fetch form
      this.state.loading.batch = true

      const res = await this.$api.baChecklist.getList()

      if (res.success) {
        let item = res?.data?.list?.pop()
        this.formRaw = item

        let isRegistration = item?.id
        this.isDraft = item?.status === 'draft'

        let formId = item?.id

        this.state.dialog.registration =
          !isRegistration || this.isDraft === true

        if (formId) {
          this.fetchForm(formId)
        }
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.state.loading.batch = false
    },

    async fetchForm(id) {
      this.state.loading.form = true
      let res = await this.$api.incubator.form.getOne(id)

      if (res.success) {
        this.form = res.data

        let revised = this.mergeFields(res.data?.data?.pages)?.filter((x) => {
          return (
            x?.status === 'revision' && x.validatedBy?.permission === 'kadiv'
          )
        })

        this.isRevised = revised?.length > 0
        this.state.dialog.revised = this.isRevised
      }

      this.state.loading.form = false
    },

    onCloseRegistrationDialog() {
      this.state.dialog.registration = false
    },

    onCloseDialogRevised() {
      this.state.dialog.revised = false
    },

    onAssessment() {
      this.$router.push({
        path: '/incubator/registration/registration',
        query: {
          batchId: this.form?.batch?.id,
          formId: this.form?.id,
          dynamicForm: this.formRaw?.batch?.dynamicForm,
          batchName: this.formRaw?.batch?.title
        }
      })
    },

    onRegister() {
      this.$router.push('/incubator/registration')
    },

    async onRevised() {
      this.$router.push({
        path: '/incubator/my-assessment/revised',
        query: {
          batchId: this.form?.batch?.id,
          formId: this.form?.id,
          dynamicForm: this.formRaw?.batch?.dynamicForm
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-link {
  font-weight: bold;
  &:hover {
    text-decoration: underline !important;
  }
}
</style>
