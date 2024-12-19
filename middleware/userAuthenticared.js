// continue if authenticated
// redirect if not authenticated
export default function ({ store, redirect, route }) {
  if (!store.getters["auth/isLogin"]) {
    redirect(`/login`);
  }
}
