<template>
  <div>
    <div class="pl-12 pr-6 py-6">
      <div v-for="(item, index) in childComment" :key="index">
        <div class="mb-7">
          <div class="d-flex align-center">
            <general-avatar size="54" :image="getAvatar(item)" />

            <div class="ml-4">
              <div class="d-flex align-center">
                <p class="h7--xxsmall dark--text">
                  {{ item.user.name }}
                </p>
              </div>
              <p class="text--small dark--text">
                {{ fullDateTime(item.createdAt) }}
              </p>
            </div>

            <v-chip color="#02AAA4" class="ml-2">
              <span class="white--text">{{ item.userRole }}</span>
            </v-chip>
          </div>
          <p class="p--default dark--text text-break text-pre-line">
            {{ item.content }}
          </p>
        </div>
      </div>

      <p
        v-if="isMoreComment"
        class="h8--supersmall primary--text pointer mt-4"
        @click="onEmitLoadMore()"
      >
        Lihat {{ paging.count - paging.limit }} balasan lainnya
      </p>
    </div>
  </div>
</template>

<script>
import pipe from '@/mixins/pipe'
export default {
  mixins: [pipe],
  props: {
    childComment: {
      type: Array
    },
    paging: {
      type: Object
    }
  },

  computed: {
    isMoreComment() {
      return this.paging.next
    }
  },

  methods: {
    getAvatar(val) {
      return val.user?.image?.url || ''
    },

    onEmitLoadMore() {
      this.$emit('on:load-comment')
    }
  }
}
</script>
