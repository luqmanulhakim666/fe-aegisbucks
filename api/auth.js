import qs from "query-string";

export default (ctx) => {
  let { $axios } = ctx;
  let url = "/user";
  return {
    async handleGoogleLogin(query = {}) {
      let q = qs.stringify(query);

      return await $axios.get(`/auth/google/callback?${q}}`);
    },

    async login(body) {
      return await $axios.post(`${url}/signin`, body);
    },

    async getProfile() {
      return await $axios.get(`${url}/profile`);
    },

    async verifyEmail(query = {}) {
      let q = qs.stringify(query);
      return await $axios.get(`${url}/verify-email?${q}`);
    },

    async forgotPassword(email) {
      return await $axios.post("/auth/password/forgot", email);
    },

    async resetPassword(body) {
      return await $axios.put("/auth/password/reset", body);
    },

    async changePassword(body) {
      return await $axios.post(`${url}/password/change`, body);
    },

    async googleLogin(key, body) {
      let res = await $axios.post(`auth/sso/${key}`, body);
      return res;
    },
  };
};
