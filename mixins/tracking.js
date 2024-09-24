export default {
  methods: {
    async tracking(event, body) {
      body.event = event;
      this.$store.dispatch("campaign/tracking", body);
    },
  },
};
