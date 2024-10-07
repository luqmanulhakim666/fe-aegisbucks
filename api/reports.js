import qs from "query-string";

export default (ctx) => {
  let { $config, store } = ctx;
  let url = "/report";

  return {
    export(data, query = {}, token) {
      query.authorization = `Bearer ${token}`;
      let q = qs.stringify(query);
      const api = `${$config.API_URL}`;

      return `${api}${url}/${data}/export?${q}`;
    },
  };
};
