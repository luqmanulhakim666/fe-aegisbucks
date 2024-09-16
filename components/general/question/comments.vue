<template>
  <div>
    <div class="white rounded-xl mt-6">
      <div class="pa-6">
        <div class="d-flex align-center mt-6">
          <general-avatar size="54" :image="getAvatar(item)" />

          <div class="ml-4">
            <p class="h7--xxsmall dark--text">{{ item.user.name }}</p>
            <p class="text--small dark--text">
              {{ fullDateTime(item.createdAt) }}
            </p>
          </div>

          <v-chip color="#02AAA4" class="ml-4">
            <span class="white--text">{{ humanizeRole(item.userRole) }}</span>
          </v-chip>
        </div>
        <p class="p--default dark--text text-break text-pre-line">
          {{ item.content }}
        </p>
        <div class="d-flex align-center mt-4">
          <div class="d-flex align-center mr-3" v-if="state.paging.count">
            <v-icon class="mr-1" size="16">mdi-forum</v-icon>
            <p
              class="h8--supersmall dark--text pointer"
              @click="onShowComments()"
            >
              {{ state.isHidden ? 'Lihat' : 'Sembunyikan' }}
              {{ state.paging.count }} Balasan
            </p>
          </div>

          <div
            class="d-flex align-center pointer"
            @click="onReply()"
            v-if="isAllowPost"
          >
            <v-icon class="mr-1" size="16">mdi-arrow-left-top</v-icon>
            <p class="h8--supersmall dark--text pointer">Balas</p>
          </div>
        </div>
      </div>

      <!-- sub commebt -->
      <v-expand-transition>
        <div v-if="!state.isHidden && state.paging.count">
          <v-divider />
          <general-question-child
            :childComment="items.childComment"
            :paging="state.paging"
            @on:load-comment="onLoadComment()"
          />
        </div>
      </v-expand-transition>

      <v-fade-transition>
        <div class="d-flex align-center pb-6 pl-12 pr-6" v-if="state.isReplied">
          <general-avatar size="40" :image="getAvatarIsLogin" />

          <general-form-text-field
            v-model="form.content"
            dense
            hide-details
            placeholder="Beri tanggapan.."
            outlined
            class="ml-4 full-width mr-4"
          />
          <v-btn
            depressed
            color="secondary lighten-5"
            class="text-capitalize h8--supersmall"
            :loading="state.isLoading"
            :disabled="!form.content"
            @click="onSubmit()"
            >Kirim</v-btn
          >
        </div>
      </v-fade-transition>
    </div>
  </div>
</template>

<script>
import pipe from '@/mixins/pipe'
import alert from '@/mixins/alert'

export default {
  mixins: [pipe, alert],
  props: {
    item: {
      type: Object
    },
    isAllowPost: Boolean
  },

  data: () => ({
    form: {
      content: ''
    },

    body: {
      skip: 1,
      limit: 2,
      sort: 'latest',
      parent: '',
      key: ''
    },

    items: {
      childComment: []
    },

    state: {
      isHidden: true,
      isReplied: false,
      isLoading: false,
      paging: {}
    }
  }),

  created() {
    this.fetchChild()
  },

  methods: {
    async fetchChild() {
      let payload = {
        ...this.body,
        parent: this.item?.id
      }
      let res = await this.$api.forumComment.getList(this.forumId, payload)

      if (res.success) {
        this.items.childComment = res.data.list
        this.state.paging = res.data.paging
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }
    },

    async onSubmit() {
      this.state.isLoading = true

      let payload = {
        parent: this.item?.id,
        content: this.form.content
      }

      let res = await this.$api.forumComment.create(this.forumId, payload)

      if (res.success) {
        this.fetchChild()
        this.form.content = ''
        if (this.state.isHidden) {
          this.state.isHidden = !this.state.isHidden
        }
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.state.isLoading = false
    },

    onLoadComment() {
      this.body.skip += 2
      this.fetchChild()
    },

    onShowComments() {
      this.state.isHidden = !this.state.isHidden
    },

    onReply() {
      this.state.isReplied = !this.state.isReplied
    },

    getAvatar(val) {
      return val.user?.image?.url || ''
    }
  },

  computed: {
    forumId() {
      return this.$route?.params?.slug
    },

    profile() {
      return this.$store.getters['auth/profile']
    },

    getAvatarIsLogin() {
      return this.profile?.image
    }
  }
}
</script>
