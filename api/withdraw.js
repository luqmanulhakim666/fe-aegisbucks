import qs from "query-string";

export default (ctx) => {
  let { $axios } = ctx;
  let url = "/withdraw";
  return {
    async getList(query = {}) {
      let q = qs.stringify(query);
      return await $axios.get(`${url}?${q}`);
    },

    async getListBanks(query = {}) {
      let q = qs.stringify(query);
      return await $axios.get(`${url}/bank?${q}`);
    },

    async create(body) {
      return await $axios.post(`${url}`, body);
    },
  };
};
