import qs from "query-string";

export default (ctx) => {
  let { $axios } = ctx;
  let url = "/product-scan";
  return {
    async getList(query = {}) {
      let q = qs.stringify(query);
      return await $axios.get(`${url}?${q}`);
    },

    async verify(productScanUserId, body) {
      return await $axios.post(`${url}/user/${productScanUserId}/verify`, body);
    },

    async post(body) {
      return await $axios.post(`${url}/scan`, body);
    },
  };
};
