export default ({ store, redirect, req }) => {
  const role = store.getters["auth/role"];

  if (store.getters["auth/isLogin"] && role === "cust") {
    redirect(`/`);
  }
};
