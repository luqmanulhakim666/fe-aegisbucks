export default ({ store, redirect, req }) => {
  if (store.getters['auth/isLogin']) {
    const role = store.getters['auth/role']
    redirect(`/${role}/dashboard`)
  }
}
