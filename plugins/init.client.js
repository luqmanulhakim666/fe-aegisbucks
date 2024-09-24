// Initialize things only on client side

export default async ({ store }) => {
  console.log("init");
  try {
    const isLogin = await store.dispatch("auth/loadAuth");
    if (isLogin) await store.dispatch("auth/fetchProfile");
  } catch (error) {}
};
