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
  },
};
