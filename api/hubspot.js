import qs from "query-string";

export default (ctx) => {
  let { $axios } = ctx;
  let url = "/campaign";
  return {
    async handleGoogleLogin(query = {}) {
      let q = qs.stringify(query);

      return await $axios.get(`/auth/google/callback?${q}}`);
    },

    async sendContact({ body, id }) {
      let formData = new window.FormData();
      formData.append("file", body.file);

      return await $axios.post(
        `/campaign/${id}/send-contact/hubspot`,
        formData
      );
    },
  };
};
