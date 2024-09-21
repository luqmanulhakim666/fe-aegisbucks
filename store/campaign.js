const Cookie = process.client ? require("js-cookie") : undefined;

const defaultState = {
  data: {},
};

export const state = () => ({
  ...defaultState,
});

export const mutations = {
  SET_CAMPAIGN(state, payload) {
    state.data = payload;
  },
};
export const actions = {
  /**
   * Login
   *
   * @param {String} uniqueKey
   * @param {String} password
   */
  async getDetail({ dispatch }, id) {
    let res = await this.$api.campaigns.getOne(id);

    if (!res.success) {
      this.dispatch("snack", [res.error.message, "error", "mdi-close-circle"]);
      return res;
    }

    let { data } = res.data;

    // await dispatch('setToken', 'Bearer ' + accessToken)
    await dispatch("setCampaign", data);

    return res;
  },

  /**
   * SET Campaign
   *
   *
   */
  async setCampaign({ commit }, payload) {
    commit("SET_CAMPAIGN", payload);
  },
};

export const getters = {
  data(state) {
    return state.data;
  },
};
