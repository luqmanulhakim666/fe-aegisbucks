import qs from "query-string";

export default (ctx) => {
  let { $axios } = ctx;
  let url = "/campaign";
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

    voucher: {
      async upload(body) {
        let formData = new window.FormData();
        formData.append("file", body.file);
        formData.append("retailId", body.retailId);
        formData.append("productId", body.productId);
        formData.append("expiredDate", body.expiredDate);
        formData.append("limit", body.limit);
        formData.append("usageInstruction", body.usageInstruction);

        return await $axios.post(`${url}/${body.id}/voucher`, formData);
      },

      async getList(id) {
        return await $axios.get(`${url}/${id}/voucher`);
      },
    },
  };
};
