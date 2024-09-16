export default function (context) {
  let page = context.route.meta[0].page || "";
  let role = context.store.getters["auth/role"];
  let isAuthorized = role === page;

  if (!isAuthorized) {
    context.redirect("/auth/logout");
  }
}
