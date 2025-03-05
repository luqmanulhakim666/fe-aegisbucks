export default function ({ store, redirect, route }) {
  const role = store.getters["auth/role"];

  console.log("role", role);

  if (!store.getters["auth/isLogin"]) {
    redirect(`/login`);
  }

  if (role !== "cust") {
    store.dispatch("auth/logout");
  }
}
