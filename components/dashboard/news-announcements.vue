<template>
  <section class="section__news">
    <h1 class="dark--text h3--large mb-4">Berita & Pengumuman</h1>
    <v-row>
      <v-col v-for="(item, i) of items" :key="i" cols="12" md="4">
        <v-card
          flat
          class="section__news-card rounded-xxl pointer"
          @click="onDetail(item.id)"
        >
          <v-img
            :src="getImage(item)"
            gradient="to top right, rgba(51, 51, 51, 0.5), rgba(51, 51, 51, 0.5)"
            height="160"
            class="align-end"
          >
            <v-card-title class="white--text text--small section__news-text">{{
              item.type === 'registration' ? 'Pendaftaran' : 'Berita'
            }}</v-card-title>
            <v-card-text>
              <p class="white--text h7--xxsmall two-lines">
                {{ item.title }}
              </p>
            </v-card-text>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import alert from '@/mixins/alert'
import pipe from '@/mixins/pipe'

export default {
  props: {
    target: String
  },
  mixins: [alert, pipe],
  data: () => ({
    body: {
      page: 1,
      limit: 3,
      keyword: '',
      published: true,
      type: '',
      target: '',
      sort: 'latest'
    },
    paging: {},
    state: {
      isLoading: false
    },
    items: []
  }),

  created() {
    this.fetch()
  },

  methods: {
    onDetail(id) {
      this.$router.push({ path: '/article', query: { id: id } })
    },
    getImage(val) {
      return val?.image?.url || ''
    },
    async fetch() {
      this.state.isLoading = true

      this.body.target = this.target

      const res = await this.$api.news.getList({ ...this.body })

      if (res.success) {
        this.items = res.data.list
        this.paging = res.data.paging
      }

      if (!res.success) {
        this.setFailedAlert(res)
      }

      this.state.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.section__news {
  &-card {
    &:hover {
      box-shadow: 0px 15px 20px rgba(0, 69, 172, 0.1) !important;
    }
  }
  &-text {
    padding-bottom: 5px;
  }
}
</style>
