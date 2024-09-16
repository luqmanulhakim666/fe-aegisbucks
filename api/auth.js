import qs from "query-string";

export default (ctx) => {
  let { $axios } = ctx;
  let url = "/user";
  return {
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
      return await $axios.get(`${url}/password/forgot/${email}`);
    },

    async resetPassword(body) {
      return await $axios.post(`${url}/password/reset`, body);
    },

    async changePassword(body) {
      return await $axios.post(`${url}/password/change`, body);
    },

    updateProfile: {
      async admin(body) {
        return await $axios.put("/admin", body);
      },
      async incubator(body) {
        return await $axios.put("/incubator", body);
      },
      async tenant(body) {
        return await $axios.put("/tenant", body);
      },
    },

    register: {
      async incubator(body) {
        return await $axios.post(`${url}/register/incubator`, body);
      },

      async tenant(body) {
        return await $axios.post(`${url}/register/tenant`, body);
      },
    },
  };
};
