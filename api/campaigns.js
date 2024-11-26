import qs from "query-string";

export default (ctx) => {
  let { $axios, $config, store } = ctx;
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

    async publish(campaignId, body) {
      return await $axios.put(`${url}/${campaignId}/publish`, body);
    },

    async claimVoucher(body) {
      return await $axios.post(`${url}/claim-voucher-code`, body);
    },

    async tracking(body) {
      return await $axios.post("/user-analytic", body);
    },

    claim: {
      async detail(campaignId, groupId) {
        return await $axios.get(
          `${url}/${campaignId}/voucher-claim/${groupId}`
        );
      },
    },

    voucher: {
      async getList(id, query = {}) {
        let q = qs.stringify(query);

        return await $axios.get(`${url}/${id}/voucher?${q}`);
      },

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

      async update(campaignId, voucherId, body) {
        return await $axios.put(
          `${url}/${campaignId}/voucher/${voucherId}`,
          body
        );
      },

      async delete(campaignId, voucherId) {
        return await $axios.delete(`${url}/${campaignId}/voucher/${voucherId}`);
      },

      async getDetail(campaignId, voucherId) {
        return await $axios.get(`${url}/${campaignId}/voucher/${voucherId}`);
      },

      async getListVoucherCode(campaignId, voucherId, query = {}) {
        let q = qs.stringify(query);
        return await $axios.get(
          `${url}/${campaignId}/voucher/${voucherId}/code?${q}`
        );
      },
    },

    public: {
      async getOne(brandSlug, campaignSlug, query = {}) {
        let q = qs.stringify(query);

        return await $axios.get(
          `${url}/public/${brandSlug}/${campaignSlug}?${q}`
        );
      },

      async product(brandSlug, campaignSlug, productSlug, query = {}) {
        let q = qs.stringify(query);

        return await $axios.get(
          `${url}/public/${brandSlug}/${campaignSlug}/${productSlug}?${q}`
        );
      },
    },

    report: {
      async getSummary(campaignId, query = {}) {
        let q = `?${qs.stringify(query)}`;
        return await $axios.get(`${url}/${campaignId}/report/summary${q}`);
      },

      async getPageView(campaignId, query = {}) {
        let q = `?${qs.stringify(query)}`;
        return await $axios.get(`${url}/${campaignId}/report/page-views${q}`);
      },

      async getProductRetailStock(campaignId, query = {}) {
        let q = `?${qs.stringify(query)}`;
        return await $axios.get(
          `${url}/${campaignId}/report/retail-product-stocks${q}`
        );
      },

      async getVoucherClaims(campaignId, query = {}) {
        let q = `?${qs.stringify(query)}`;
        return await $axios.get(
          `${url}/${campaignId}/report/voucher-claims${q}`
        );
      },

      export(campaignId, data, query = {}, token) {
        query.authorization = `Bearer ${token}`;
        let q = qs.stringify(query);
        const api = `${$config.API_URL}`;

        return `${api}/report/campaign/${campaignId}/${data}/export?${q}`;
      },
    },
  };
};
