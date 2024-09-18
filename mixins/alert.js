export default {
  methods: {
    isSuccess(status) {
      return status === 201;
    },

    setSuccessAlert(label) {
      this.$store.dispatch("snack", [
        label,
        "success lighten-2",
        "mdi-check-circle",
      ]);
    },

    setFailedAlert(res) {
      this.$store.dispatch("snack", [
        res.error?.message || res.message,
        "error lighten-2",
        "mdi-close-circle",
      ]);
    },
  },
};
