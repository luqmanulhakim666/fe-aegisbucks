import qs from "query-string";

export default (ctx) => {
  let { $config, store } = ctx;
  let token = `Bearer ${store.getters["auth/isToken"]}`;
  let url = "/report";

  return {
    export(data, query = {}) {
      query.authorization = token;
      let q = qs.stringify(query);
      const api = `${$config.API_URL}`;

      return `${api}${url}/${data}/export?${q}`;
    },
  };
};
