import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export default {
  methods: {
    generateUUID() {
      return uuidv4();
    },

    trackEvent(eventName, params) {
      const url = window.location.href;

      let identity = null;
      let googleId = null;
      let name = null;
      let email = null;
      let phone = null;

      if (this.isAuthenticated) {
        // Check if the user is logged in via Google (based on cookies)
        googleId = this.profile.sub;
        name = this.profile.name;
        email = this.profile.email;
        identity = "email";
      }

      if (!this.isAuthenticated) {
        let user_uuid = Cookies.get("user_uuid");

        if (!user_uuid) {
          user_uuid = uuidv4();
          Cookies.set("user_uuid", user_uuid);
        }

        identity = user_uuid;
      }

      const payload = {
        event: eventName,
        url: url,
        data: params,
        identity: identity,
        name: name,
        email: email,
        googleId: googleId,
        phone: phone,
      };

      this.$store.dispatch("campaign/tracking", payload);
    },

    checkGoogleAuth() {
      this.$store.dispatch("auth/loadGoogleAuth");
    },
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isGoogleAuth"];
    },

    profile() {
      return this.$store.getters["auth/googleProfile"];
    },

    isPreview() {
      return this.$route.query?.__preview;
    },
  },
};
