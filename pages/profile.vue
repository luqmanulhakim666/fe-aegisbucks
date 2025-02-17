<template>
  <div class="container">
    <v-row dense>
      <v-col cols="12" md="3" sm="4" align-self="center">
        <general-avatar
          image=""
          class="d-flex mx-auto flex-column justify-xs-center align-center d-sm-block mb-6 mb-sm-0"
        />
      </v-col>
      <v-col
        cols="12"
        md="9"
        sm="8"
        align-self="center"
        class="d-flex mx-auto flex-column justify-xs-center align-center d-sm-block"
      >
        <p class="h5--small dark--text">{{ profile.name }}</p>
        <p class="text--default dark--text">{{ profile.email }}</p>

        <template v-if="!profile.emailVerified">
          <p class="text--default dark--text mt-4">akun belum terverifikasi</p>
          <div class="d-flex align-center mt-2">
            <v-btn
              rounded
              depressed
              small
              class="success text-capitalize h7--xxsmall mr-2"
              >Lengkapi Profile</v-btn
            >
            <app-point :points="400" />
          </div>
        </template>
      </v-col>
    </v-row>

    <template v-if="!profile.emailVerified">
      <div class="d-flex align-center dark lighten-3 justify-center pa-2 mt-10">
        <v-icon size="34" color="secondary lighten-2"
          >mdi-lightbulb-on-outline</v-icon
        >
        <p class="h6--xsmall dark--text ml-4">
          lengkapi profil untuk bisa mendapatkan lebih banyak reward dari
          LetsbuyAsia
        </p>
      </div>
    </template>

    <v-row>
      <v-col cols="12" md="6">
        <div class="dark lighten-3 rounded-lg mt-4 pa-6">
          <p class="ml-5 h6--xsmall">Saldo Reward</p>
          <app-point :points="600" />
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div class="dark lighten-3 rounded-lg mt-4 pa-6">
          <p class="ml-5 h6--xsmall">Saldo Reward</p>
          <app-point :points="600" />
        </div>
      </v-col>
    </v-row>

    <div class="pa-2 dark lighten-3 mt-4">
      <p class="h5--small dark--text">Akun</p>
    </div>

    <p class="h7--xxsmall mt-4">Email</p>
    <div
      class="border-thin pa-3 d-flex align-center justify-space-between rounded-lg"
    >
      <p>{{ profile.email }}</p>

      <v-btn
        @click="onEmailVerify()"
        depressed
        small
        :loading="loading.verifyEmail"
        class="success lighten-1 text-capitalize h7--xxsmall dark--text rounded-pill"
      >
        Verifikasi
      </v-btn>

      <div class="d-flex align-center" v-if="profile.emailVerified">
        <v-icon color="success">mdi-check-circle</v-icon>
        <p class="text--default dark--text ml-1">Terverifikasi</p>
      </div>
    </div>

    <div class="pa-2 dark lighten-3 my-4">
      <p class="h5--small dark--text">Lainnya</p>
    </div>

    <div v-for="(item, index) in items" :key="index">
      <div class="d-flex align-center mb-6">
        <v-icon size="24" class="mr-3 dark--text">{{ item.icon }}</v-icon>
        <p class="text-default">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/mixins/utils";
export default {
  layout: "app",
  mixins: [utils],
  data: () => ({
    hasSentEmail: false,
    loading: {
      verifyEmail: false,
      submit: false,
    },
    items: [
      {
        label: "Hubungi Help Center (WhatsApp)",
        key: "whatsapp",
        icon: "mdi-whatsapp",
      },
      {
        label: "Hubungi Help Center (Instagram)",
        key: "whatsapp",
        icon: "mdi-face-agent",
      },
      {
        label: "Kebijakan Privasi",
        key: "whatsapp",
        icon: "mdi-security",
      },
      {
        label: "Syarat dan Ketentuan",
        key: "whatsapp",
        icon: "mdi-file-document-outline",
      },
      {
        label: "Logout",
        key: "whatsapp",
        icon: "mdi-logout",
      },
    ],
  }),
  computed: {
    profile() {
      return this.$store.getters["auth/profile"];
    },
    seconds() {
      return this.$dayjs(this.timer).format("ss");
    },
  },

  methods: {
    async onEmailVerify() {
      return;
      this.loading.verifyEmail = true;
      if (this.hasSentEmail) {
        this.setFailedAlert({ message: "Verifikasi Email Sudah Dikirim" });
        return;
      }

      const res = await this.$api.auth.sendVerifyEmail();

      if (!this.hasSentEmail) {
        if (res.success) {
          this.hasSentEmail = true;
          this.setSuccessAlert("Verifikasi Email Terkirim");
        }

        if (!res.success) {
          this.setFailedAlert(res);
        }
      }

      this.loading.verifyEmail = true;
    },
  },
};
</script>
