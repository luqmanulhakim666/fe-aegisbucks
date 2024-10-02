<template>
  <div>
    <general-loading />
  </div>
</template>

<script>
import meta from "@/mixins/meta";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  layout: "empty",
  mixins: [meta],

  data: () => ({
    meta: {
      title: "Google Verifiying",
    },
  }),
  async mounted() {
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

      await this.$store.dispatch("auth/setGoogleToken", result.access_token);
      await Cookie.set("googleProfile", JSON.stringify(userInfo));

      window.location.href = Cookie.get("googleCallback");
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  },
};
</script>
