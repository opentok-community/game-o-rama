import store from "@/state/Store";

export const roomGuard = (to, from, next) => {
  const sessionId = store.getters.getSessionId;
  const token = store.getters.getToken;

  if (
    sessionId === undefined ||
    sessionId.length === 0 ||
    token === undefined ||
    token.length === 0
  ) {
    return next("/");
  } else {
    return next();
  }
};
