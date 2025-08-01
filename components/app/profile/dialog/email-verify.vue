<template>
  <v-dialog v-model="dialog" width="300" persistent :fullscreen="isMobile">
    <div
      class="white pa-6 rounded-xl fill-height d-flex flex-column align-center justify-center"
    >
      <v-card flat width="150">
        <v-img
          class="d-flex mx-auto"
          width="150"
          src="/images/email-verify.png"
        />
      </v-card>

      <p class="h5--small dark--text mt-6 mb-2 text-center">
        Check Inbox Email untuk Melanjutkan
      </p>

      <p class="text--default dark--text text-center">
        Kami mengirimkan instruksi untuk melanjutkan ke home page aegisbucks.com
      </p>

      <div class="d-flex justify-center mt-6">
        <span
          v-if="timer === 0"
          class="pointer text--default primary--text mt-2 mb-4"
          @click="onResendVerifyEmail"
        >
          Kirim ulang
        </span>
        <span v-else class="text--default primary--text text-center">
          {{ isExpired }}
        </span>
      </div>

      <v-card flat>
        <a
          v-if="timer > 0"
          target="_blank"
          href="https://mail.google.com/mail/u/0/#inbox"
          class="text-capitalize success lighten-1 text-capitalize dark--text h7--xxsmall v-btn v-btn--block v-size--default mt-2"
          >Buka Email</a
        >
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import screen from "@/mixins/screen";
export default {
  mixins: [screen],
  props: {
    dialog: Boolean,
    timerInMinutes: {
      type: Number,
      default: 2, // Default to 5 minutes
    },
  },

  data() {
    return {
      timer: this.timerInMinutes * 60, // Convert minutes to seconds
      intervalId: null,
    };
  },

  mounted() {
    this.startCountdown();
  },

  computed: {
    isExpired() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      return this.timer > 0
        ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
          )}`
        : null;
    },

    isEmailVerified() {
      return this.$store.getters["auth/profile"]["emailVerified"];
    },
  },

  methods: {
    startCountdown() {
      if (this.intervalId) clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.intervalId);

          if (this.emailVerified) {
            this.$emit("on:close");
            return;
          }

          if (!this.isEmailVerified) {
            this.setFailedAlert({
              message: "Link verifikasi telah expired. Silahkan kirim ulang",
            });
          }
        }
      }, 1000);
    },

    async onResendVerifyEmail() {
      if (this.isEmailVerified) {
        return this.$emit("on:close");
      }
      if (this.timer === 0) {
        const res = await this.$api.auth.sendVerifyEmail();
        if (res.success) {
          this.setSuccessAlert("Link Verifikasi Telah Dikirim");
          this.timer = this.timerInMinutes * 60; // Reset timer
          this.startCountdown();
        }
      }
    },

    onEmitClose() {
      this.$emit("on:close");
      clearInterval(this.intervalId);
    },
  },

  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
</script>
