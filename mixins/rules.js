export default {
  data() {
    return {
      required: (v) => !!v || !!v?.length || "*Required",
      link: (value) =>
        value
          ? /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(
              value
            ) || "*Link tidak valid"
          : true,
      hundred: (value) => value <= 100 || "Max 100",
      email: (v) => /.+@.+/.test(v) || "E-mail tidak valid",
      number: (v) => /^[0-9]*$/.test(v) || "Hanya menerima input angka",
    };
  },

  computed: {
    arrayRule() {
      return (val) => {
        return val?.length > 0 || "*Wajib Diisi";
      };
    },
  },

  methods: {
    async validate(isValid) {
      await this.$refs.form.validate();
      if (!isValid) {
        this.$vuetify.goTo(`.v-messages__message`, { offset: 100 });
        return false;
      }
      return true;
    },
  },
};
