import VueJwtDecode from "vue-jwt-decode";
const Cookie = process.client ? require("js-cookie") : undefined;
const cookieparser = process.server ? require("cookieparser") : undefined;

const defaultState = {
  token: null,
  profile: {},
  role: null,
  isGoogleAuth: null,
  googleProfile: {},
};

export const state = () => ({
  ...defaultState,
});

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_PROFILE(state, payload) {
    state.profile = payload;
  },
  SET_ROLE(state, payload) {
    state.role = payload;
  },
  SET_IS_GOOGLE_AUTH(state, payload) {
    state.isGoogleAuth = payload;
  },
  SET_GOOGLE_PROFILE(state, payload) {
    state.googleProfile = payload;
  },
};
export const actions = {
  /**
   * Login
   *
   * @param {String} uniqueKey
   * @param {String} password
   */
  async login({ dispatch }, params) {
    let res = await this.$api.auth.login(params);

    if (!res.success) {
      this.dispatch("snack", [res.error.message, "error", "mdi-close-circle"]);
      return res;
    }

    let { accessToken, role } = res.data;

    // await dispatch('setToken', 'Bearer ' + accessToken)
    await dispatch("setToken", accessToken);
    await dispatch("fetchProfile");
    await dispatch("setRole", role);

    this.$router.push("/admin/dashboard");

    return res;
  },

  /**
   * Logout
   *
   *
   */
  async logout({ commit, dispatch }) {
    await dispatch("unsetToken");
    await dispatch("unsetRole");
    commit("SET_PROFILE", {
      ...defaultState,
    });
    this.$router.push("/login");
  },

  /**
   * Fetch profile
   *
   *
   */
  async fetchProfile({ commit, dispatch }) {
    let payload = null;
    let res = await this.$api.auth.getProfile();

    if (!res.success) return;
    payload = {
      ...res.data,
    };
    commit("SET_PROFILE", payload);
  },

  /**
   * Set token in axios, store and localStorage
   *
   * @param {String} token
   */
  async setToken({ commit }, token) {
    if (Cookie) Cookie.set("token", token);
    this.$axios.setToken(token, "Bearer"); // axios
    commit("SET_TOKEN", token); // store
  },

  /**
   * Set role on cookies
   *
   * @param {String} token
   */
  async setRole({ commit }, role) {
    if (Cookie) Cookie.set("role", role);
    commit("SET_ROLE", role); // store
  },

  /**
   * Remove token from axios, store and localStorage
   */
  async unsetToken({ commit }) {
    this.$axios.setToken(false);
    if (Cookie) Cookie.remove("token");
    commit("SET_TOKEN", null);
  },

  /**
   * Remove role from localStorage
   */
  async unsetRole({ commit }) {
    if (Cookie) Cookie.remove("role");
    commit("SET_ROLE", null);
  },

  setTokenServer({ commit }, token) {
    // commit auth token
    commit("SET_TOKEN", token);

    // Set axios header
    this.$axios.setToken(token, "Bearer");
  },

  /**
   * 1. Load token from Cookies
   * 2. Set token to store and axios
   *
   */
  async loadAuth({ dispatch }) {
    let token = Cookie.get("token");

    if (!token) {
      return false;
    }

    await dispatch("setToken", token);
    return token;
  },

  /**
   * Handle Google Login
   *
   *
   */
  async setGoogleToken({ commit }, token) {
    // Handle login success and decode JWT token
    const decodedToken = VueJwtDecode.decode(token);

    // Store the token in cookies
    Cookie.set("googleToken", token, { expires: 7 }); // Expires in 7 days
    commit("SET_IS_GOOGLE_AUTH", true);
    commit("SET_GOOGLE_PROFILE", decodedToken);
  },

  /**
   * 1. Load token from Cookies
   * 2. Set token to store and axios
   *
   */
  async loadGoogleAuth({ dispatch, commit }, context = {}) {
    let token = null;

    // Server-side cookie handling
    if (process.server && context.req) {
      const cookies = context.req.headers.cookie;
      if (cookies) {
        const parsedCookies = cookieparser.parse(cookies);
        token = parsedCookies.googleAuth;
      }
    }

    // Client-side cookie handling
    if (process.client && Cookie) {
      token = Cookie.get("googleToken");
    }

    if (token) {
      try {
        await dispatch("setGoogleToken", token);
      } catch (error) {
        console.error("Failed to decode token", error);
        commit("SET_IS_GOOGLE_AUTH", false);
      }
    }
  },

  /**
   * Set profile
   *
   *
   */
  setProfile({ commit }, payload) {
    commit("SET_PROFILE", payload);
  },
};

export const getters = {
  isLogin(state) {
    return !!state.token;
  },
  isToken(state) {
    return state.token;
  },
  role(state) {
    return state?.role;
  },
  profile(state) {
    return state.profile;
  },
  isGoogleAuth(state) {
    return state.isGoogleAuth;
  },
  googleProfile(state) {
    return state.googleProfile;
  },
};
