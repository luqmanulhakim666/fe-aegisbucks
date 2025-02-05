export default ({ store, redirect, req }) => {
  const role = store.getters["auth/role"];

  if (role !== "admin") {
    redirect("/");
  }

  if (store.getters["auth/isLogin"]) {
    redirect(`/${role}/dashboard`);
  }
};
