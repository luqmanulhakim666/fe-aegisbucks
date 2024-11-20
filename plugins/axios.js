import qs from "query-string";

export default function ({ store, $axios, redirect, route, env }) {
  $axios.onRequest((res) => {});

  $axios.onResponse((res) => {
    return res.data;
  });

  $axios.onError((err) => {
    let res = err.response;
    let data = { ...res?.data, status: res?.status } || {};

    if (res) {
      const errStatus = [401, 403, 504];
      if (errStatus.includes(res?.status)) {
        redirect("/auth/logout");
      }
    }

    return data;
  });

  $axios.setHeader("Accept", "application/json; charset=utf-8");
  $axios.setHeader("X-Requested-With", "XMLHttpRequest");
  $axios.setHeader("no-cache", 1);
  $axios.defaults.paramsSerializer = (params) => {
    if (params.attributes)
      params.attributes = JSON.stringify(params.attributes);
    if (params.filter) params.filter = JSON.stringify(params.filter);
    if (params.order) params.order = JSON.stringify(params.order);
    return qs.stringify(params);
  };
}
