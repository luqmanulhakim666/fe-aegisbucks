import qs from "query-string";

export default (ctx) => {
  let { $axios } = ctx;
  let url = "/product";
  return {
    async getList(query = {}) {
      let q = qs.stringify(query);
      return await $axios.get(`${url}?${q}`);
    },

    async create(body) {
      return await $axios.post(`${url}`, body);
    },

    async getOne(id) {
      return await $axios.get(`${url}/${id}`);
    },

    async update(id, body) {
      return await $axios.put(`${url}/${id}`, body);
    },

    async delete(id) {
      return await $axios.delete(`${url}/${id}`);
    },

    scan: {
      async getList(query = {}) {
        let q = qs.stringify(query);
        return await $axios.get(`${url}-scan?${q}`);
      },

      async getListVerifyPoint(query = {}) {
        let q = qs.stringify(query);
        return await $axios.get(`${url}-scan/user?${q}`);
      },

      async create(body) {
        return await $axios.post(`${url}-scan`, body);
      },

      async getOne(id) {
        return await $axios.get(`${url}-scan/${id}`);
      },

      async update(id, body) {
        return await $axios.put(`${url}-scan/${id}`, body);
      },

      async delete(id) {
        return await $axios.delete(`${url}-scan/${id}`);
      },
    },
  };
};
