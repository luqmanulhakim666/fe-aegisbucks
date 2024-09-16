<template>
  <div>
    <div class="white rounded-xl pa-6 mt-8" v-if="isAllowPost">
      <h2 class="dark--text h5--small mb-4">Ajukan Pertanyaan</h2>
      <div class="d-flex justify-space-between">
        <general-avatar size="54" :image="getAvatar" />
        <general-form-text-area
          v-model="form.content"
          bold
          outlined
          placeholder="Ketik pertanyaan"
          class="text-area full-width ml-4"
        />
      </div>

      <div class="d-flex justify-end">
        <v-btn
          depressed
          class="h7--xxsmall white--text text-capitalize secondary lighten-5"
          :loading="state.isLoading"
          :disabled="!form.content"
          @click="onSubmit()"
          >Kirim</v-btn
        >
      </div>
    </div>

    <general-question-comments
      v-for="(item, index) in items.parentComment"
      :key="index"
      :item="item"
      :form="form"
      :isAllowPost="isAllowPost"
    />
  </div>
</template>

<script>
import alert from '@/mixins/alert'

export default {
  mixins: [alert],
  props: {
    isAllowPost: Boolean
  },
  data: () => ({
    form: {
      content: ''
    },

    body: {
      skip: 1,
      limit: 10,
      sort: 'latest',
      parent: 'null',
      key: ''
    },

    items: {
      parentComment: []
    },

    state: {
      isLoading: false
    }
  }),

  created() {
    this.getOne()
  },

  methods: {
    async getOne() {
      let res = await this.$api.forumComment.getList(this.forumId, this.body)

      if (res.success) {
        this.items.parentComment = res.data.list
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.$forceUpdate()
    },

    async onSubmit() {
      this.state.isLoading = true

      let payload = {
        parent: null,
        content: this.form.content
      }

      let res = await this.$api.forumComment.create(this.forumId, payload)

      if (res.success) {
        this.form.content = ''
        this.getOne()
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.state.isLoading = false
    }
  },

  computed: {
    forumId() {
      return this.$route?.params?.slug
    },

    profile() {
      return this.$store.getters['auth/profile']
    },

    getAvatar() {
      return this.profile?.image
    }
  }
}
</script>
