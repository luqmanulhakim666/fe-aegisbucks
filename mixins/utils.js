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
  },

  methods: {
    onDigits(event) {
      let keyCode = event.keyCode;
      if (keyCode < 48 || keyCode > 57) {
        event.preventDefault();
      }
    },
  },
};
