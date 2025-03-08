export default function (context) {
  const role = context.store.getters["auth/role"];

  if (role !== "admin" || !context.store.getters["auth/isLogin"]) {
    return context.redirect("auth/logout");
  }
}
