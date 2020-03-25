import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import * as types from "./Mutations";

Vue.use(Vuex);

const functionUrl = process.env.VUE_APP_FUNCTION_URL;

export default new Vuex.Store({
  state: {
    sessionId: "",
    token: "",
    roomName: "",
    loading: false
  },
  mutations: {
    login(state, payload) {
      state.roomName = payload.roomName;
      state.sessionId = payload.sessionId;
      state.token = payload.token;
    },
    logout(state) {
      state.sessionId = "";
      state.token = "";
    },
    loading(state, isLoading) {
      state.loading = isLoading;
    },
    saveRoom(state, roomName) {
      state.roomName = roomName;
    }
  },
  actions: {
    async login(context, payload) {
      context.commit(types.LOADING, true);
      context.commit(types.USER_LOG_IN, payload);
      context.commit(types.LOADING, false);
    },
    logout(context) {
      context.commit(types.USER_LOG_OUT);
      context.commit(types.LOADING, false);
    },
    async saveRoom(context, payload) {
      if (payload && payload.roomName) {
        context.commit(types.SAVE_ROOM, payload.roomName);
      } else {
        const room = (
          await axios.post(
            `${functionUrl}/GetRoomName`,
            {},
            {
              "Content-Type": "application/json"
            }
          )
        ).data.roomName;
        context.commit(types.SAVE_ROOM, room);
      }
    }
  },
  getters: {
    getSessionId: state => {
      return state.sessionId;
    },
    getToken: state => {
      return state.token;
    },
    getRoomName: state => {
      return state.roomName;
    }
  }
});
