import qs from "query-string";

export default (ctx) => {
  let { $axios } = ctx;
  let url = "/merchant";
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

    category: {
      async getList(query = {}) {
        let q = qs.stringify(query);
        return await $axios.get(`${url}-category?${q}`);
      },

      async create(body) {
        return await $axios.post("${url}-category", body);
      },

      async getOne(id) {
        return await $axios.get(`${url}-category/${id}`);
      },

      async update(id, body) {
        return await $axios.put(`${url}-category/${id}`, body);
      },

      async delete(id) {
        return await $axios.delete(`${url}-category/${id}`);
      },
    },
  };
};
