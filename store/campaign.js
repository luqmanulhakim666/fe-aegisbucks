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

  async getDetailPublic({ dispatch }, payload) {
    let res = await this.$api.campaigns.public.getOne(
      payload.brandSlug,
      payload.campaignSlug,
      { __preview: payload.preview }
    );

    if (!res.success) {
      // this.dispatch("snack", [res.error.message, "error", "mdi-close-circle"]);
      return res;
    }

    await dispatch("setCampaign", res.data);

    return res;
  },

  async getDetailProductPublic({ dispatch }, payload) {
    let res = await this.$api.campaigns.public.product(
      payload.brandSlug,
      payload.campaignSlug,
      payload.producId,
      { __preview: payload.preview }
    );

    if (!res.success) {
      this.dispatch("snack", [res.error.message, "error", "mdi-close-circle"]);
      return res;
    }

    await dispatch("setCampaign", res.data);

    return res;
  },

  /**
   * Tacking
   *
   *
   */
  async tracking({ commit }, payload) {
    const body = {
      event: payload.event,
      data: {
        campaignId: payload.campaignId,
      },
      identity: payload.identity,
      name: payload.name,
      email: payload.email,
      googleId: payload.googleId,
      phone: payload.phone,
    };

    const res = await this.$api.campaigns.tracking(body);

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
