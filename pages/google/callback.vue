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
          class="mt-8 secondary text-capitalize h7--xxsmall"
          >Kembali</v-btn
        >
      </div>
    </v-dialog>
  </div>
</template>

<script>
import meta from "@/mixins/meta";
import { state } from "../../store/auth";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  layout: "empty",
  mixins: [meta],

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
    const hash = window.location.hash.substr(1);
    const result = hash.split("&").reduce((res, item) => {
      const parts = item.split("=");
      res[parts[0]] = parts[1];
      return res;
    }, {});

    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${result.access_token}`,
          },
        }
      );

      const userInfo = await response.json();

      if (!userInfo?.email?.includes("@gmail.com")) {
        this.state.isDialog = true;
        this.state.isLoading = false;
        return;
      }

      await this.$store.dispatch("auth/setGoogleToken", result.access_token);
      await Cookie.set("googleProfile", JSON.stringify(userInfo));

      window.location.href = Cookie.get("googleCallback");
    } catch (error) {
      console.error("Error fetching user info:", error);
    }

    this.state.isLoading = false;
  },

  methods: {
    goBack() {
      window.location.href = Cookie.get("googleCallback");
    },
  },
};
</script>
