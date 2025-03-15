export default {
  computed: {
    mergeFields() {
      return (val) => {
        let fields = val?.map((x) => {
          return x.fields;
        });

        return [].concat.apply([], fields);
      };
    },

    getYearRange() {
      let startYear = 2023;
      const currentYear = new Date().getFullYear();
      let years = [];

      while (startYear <= currentYear + 7) {
        years.push(startYear++);
      }

      return years?.map((x) => {
        return { name: x, key: x };
      });
    },

    isCreated() {
      return this.$route.params.slug === "create";
    },
  },

  methods: {
    countDown() {
      if (this.timer > 0) {
        setTimeout(() => {
          this.timer = this.timer - Math.floor(60 * 5 * 3.333);
          this.countDown();
        }, 1000);
      } else if (this.timer < 1000) {
        this.timer = 0;
      }
    },

    toInt(val) {
      if (val) {
        return parseInt(val?.replace(/\./g, ""));
      }
    },
    decimal(val) {
      if (val) {
        return String(val)
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
    },
    onDigits(event) {
      let keyCode = event.keyCode;
      if (keyCode < 48 || keyCode > 57) {
        event.preventDefault();
      }
    },

    copyLink(url, message) {
      if (!url) return;
      let msg = message || "Link copied to clipboard!";

      navigator?.clipboard?.writeText(url)?.then(
        () => {
          this.$store.dispatch("snack", [
            msg,
            "success lighten-2",
            "mdi-check-circle",
          ]);
        },
        (err) => {
          this.$store.dispatch("snack", [
            "Failed to copy link",
            "error",
            "mdi-close-circle",
          ]);
        }
      );
    },
  },
};
