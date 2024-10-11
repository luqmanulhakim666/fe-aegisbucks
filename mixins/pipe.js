export default {
  methods: {
    toISOString(value) {
      if (this.$dayjs(value).isValid()) return this.$dayjs(value).toISOString();
      return null;
    },
    yearMonthDate(value) {
      if (value) {
        return this.$dayjs(value).format("YYYY-MM-DD");
      }
      return "";
    },

    dateMonthYear(value, seperator = "/") {
      let s = seperator;
      if (value) {
        return this.$dayjs(value).format(`DD${s}MM${s}YYYY`);
      }
      return "";
    },

    dateMonthTextYear(value, seperator = "/") {
      let s = seperator;
      if (value) {
        return this.$dayjs(value).format(`DD${s}MMM${s}YYYY`);
      }
      return "";
    },

    fullDateMonthTextYear(value, seperator = "/") {
      let s = seperator;
      if (value) {
        return this.$dayjs(value).format(`DD${s}MMM${s}YYYY HH:mm`);
      }
      return "";
    },

    fullDateTime(value, seperator = "/") {
      let s = seperator;
      if (value) {
        return this.$dayjs(value).format(`DD${s}MM${s}YYYY HH:mm`);
      }
      return "";
    },

    htmlToPlainText(val) {
      let removeHtmlTag = val?.replace(/(<([^>]+)>)/gi, "");
      let text = removeHtmlTag?.replace(/&(nbsp|amp|quot|lt|gt);/g, "");

      return text;
    },

    decimal(val) {
      if (val) {
        return String(val)
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      return "0";
    },
  },
};
