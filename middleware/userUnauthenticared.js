export default ({ store, redirect, req }) => {
  if (store.getters["auth/isLogin"]) {
    redirect(`/`);
  }
};
