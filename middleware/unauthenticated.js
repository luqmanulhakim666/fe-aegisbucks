export default ({ store, redirect }) => {
  const role = store.getters["auth/role"];

  if (store.getters["auth/isLogin"]) {
    if (role !== "admin") {
      redirect("/auth/logout");
    }

    redirect(`/${role}/dashboard`);
  }
};
