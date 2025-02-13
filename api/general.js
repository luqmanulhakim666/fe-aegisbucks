import qs from "query-string";

export default (ctx) => {
  let { $axios } = ctx;
  let url = "/region";

  return {
    async provincies(query = {}) {
      let q = qs.stringify(query);
      return await $axios.get(`${url}/provinces?${q}`);
    },

    async regencies(query = {}) {
      let q = qs.stringify(query);
      return await $axios.get(`${url}/regency?${q}`);
    },

    async districts(query = {}) {
      let q = qs.stringify(query);
      return await $axios.get(`${url}/district?${q}`);
    },
  };
};
