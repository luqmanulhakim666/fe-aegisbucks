import qs from 'query-string'

export default (ctx) => {
  let { $axios } = ctx
  let url = '/region'

  return {
    async provincies(query = {}) {
      let q = qs.stringify(query)
      return await $axios.get(`${url}/provinces?${q}`)
    },

    async cities(query = {}) {
      let q = qs.stringify(query)
      return await $axios.get(`${url}/cities?${q}`)
    }
  }
}
