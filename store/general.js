const Cookie = process.client ? require('js-cookie') : undefined

export const state = () => ({})

export const mutations = {}
export const actions = {
  /**
   * Fetch Batch
   *
   *
   *
   **/
  async fetchBatch({ dispatch }, keyword, loading) {
    loading = true
    // fetch dynamic form
    let payload = {
      page: 1,
      limit: 0,
      keyword: keyword || '',
      type: null,
      target: 'incubator'
    }

    let res = await this.$api.batch.getList(payload)

    loading = false

    return { ...res, loading: loading }
  }
}

export const getters = {}
