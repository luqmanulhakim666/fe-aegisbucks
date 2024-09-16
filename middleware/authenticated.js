// continue if authenticated
// redirect if not authenticated
export default function ({ store, redirect, route }) {
  let next = route.fullPath || '/'
  if (!store.getters['auth/isLogin']) {
    redirect(`/?next=${next}`)
  }
}
