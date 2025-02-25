<template>
  <v-dialog v-model="dialog" width="300" persistent>
    <div class="white pa-6 rounded-xl">
      <v-img
        class="d-flex mx-auto"
        width="150"
        src="/images/email-verify.png"
      />

      <p class="h5--small dark--text mt-6 mb-1">
        Check Inbox Email untuk Melanjutkan
      </p>

      <p class="text--default dark--text">
        kami mengirimkan instuksi untuk melanjutkan ke home page letsbuyAsia.id
      </p>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: false,
  },

  methods: {
    onEmitClose() {
      this.$emit("on:close");
    },
  },
};
</script>
