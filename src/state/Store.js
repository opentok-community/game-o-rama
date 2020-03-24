import Vue from "vue";
import Vuex from "vuex";

import * as types from "./Mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sessionId: "",
    token: "",
    loading: false
  },
  mutations: {
    login(state, sessionId, token) {
      state.sessionId = sessionId;
      state.token = token;
    },
    logout(state) {
      state.sessionId = "";
      state.token = "";
    }
  },
  actions: {
    async login(context, payload) {
      context.commit(types.LOADING, true);
      context.commit(types.USER_LOG_IN, payload.sessionId, payload.token);
      context.commit(types.LOADING, false);
    },
    logout(context) {
      context.commit(types.USER_LOG_OUT);
      context.commit(types.LOADING, false);
    }
  }
});
