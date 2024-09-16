export default {
  computed: {
    queryParams() {
      return this.$route?.query
    }
  },

  methods: {
    pushQuery(key, val) {
      let item = {}
      item[key] = val
      this.$router.push({
        query: {
          ...this.queryParams,
          ...item
        }
      })
    }
  }
}
