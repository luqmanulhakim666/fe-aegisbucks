<template>
  <div>
    <general-loading v-if="state.isLoading" />

    <v-dialog width="500" v-model="state.isDialog">
      <div
        class="white pa-6 rounded-xl d-flex flex-column align-center justify-center"
      >
        <v-icon size="62" color="error">mdi-close-octagon</v-icon>
        <h5 class="text-center h5--small dark--text text-lighten-4 mt-8">
          Email Business tidak diizinkan
        </h5>
        <h5 class="text-center h5--small dark--text text-lighten-4">
          Harap login dengan akun @gmail.com
        </h5>

        <v-btn
          @click="goBack()"
          block
          depressed
          class="mt-8 primary text-capitalize h7--xxsmall"
          >Kembali</v-btn
        >
      </div>
    </v-dialog>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
import meta from "@/mixins/meta";

export default {
  mixins: [meta],
  layout: "empty",

  data: () => ({
    state: {
      isLoading: false,
      isDialog: false,
    },
    meta: {
      title: "Google Verifiying",
    },
  }),

  async mounted() {
    this.state.isLoading = true;

    const referalCode = localStorage.getItem("referalCode");

    const token = await this.$route.query?.token;
    let profile = null;
    let emailVerified = null;

    const campaignUrl = Cookie.get("campaignUrl");

    if (!token) {
      return this.$router.push("/login");
    }

    if (token) {
      await this.$store.dispatch("auth/setToken", token);
      await this.$store.dispatch("auth/fetchProfile");
      await this.$store.dispatch(
        "auth/setRole",
        this.$store.getters["auth/profile"]["role"]
      );
      await this.$store.dispatch("auth/setGoogleToken", token);

      profile = this.$store.getters["auth/profile"];
      emailVerified = profile.emailVerified;

      await Cookie.set("googleProfile", JSON.stringify(profile));

      if (!profile?.email?.includes("@gmail.com")) {
        this.state.isDialog = true;
        this.state.isLoading = false;
        return;
      }
    }

    if (referalCode) {
      const res = await this.$api.auth.getUserCustomerByReferalCode(
        referalCode
      );

      if (res.success) {
        this.$api.auth.postReferalCode({
          userReferralId: res.data.id,
        });
      }
    }

    if (campaignUrl) {
      const isAlreadySuccess = campaignUrl?.includes("success");

      return (window.location.href = isAlreadySuccess
        ? campaignUrl
        : `${campaignUrl}?success=true`);
    }

    if (!emailVerified) {
      await this.$api.auth.sendVerifyEmail();
    }

    this.$router.push("/");

    this.state.isLoading = false;
  },

  beforeDestroy() {
    if (localStorage.getItem("referalCode")) {
      localStorage.removeItem("referalCode");
    }

    if (Cookie.get("campaignUrl")) {
      Cookie.remove("campaignUrl");
    }
  },

  methods: {
    goBack() {
      window.location.href = campaignUrl;
    },
  },
};
</script>
