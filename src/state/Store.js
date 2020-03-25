import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import * as types from "./Mutations";

Vue.use(Vuex);

const functionUrl = process.env.VUE_APP_FUNCTION_URL;

const defaultState = {
  sessionId: "",
  token: "",
  roomName: "",
  loading: false,
  isActive: false,
  topic: "",
  clues: [],
  actors: []
};

/* Actors:
 * {
 *   name: String,
 *   streamId: String,
 *   points: Number
 * }
 */

export default new Vuex.Store({
  state: {
    sessionId: "",
    token: "",
    roomName: "",
    loading: false,
    isActive: false,
    topic: "",
    clues: [],
    actors: []
  },
  mutations: {
    [types.USER_LOG_IN](state, payload) {
      state.roomName = payload.roomName;
      state.sessionId = payload.sessionId;
      state.token = payload.token;
    },
    [types.USER_LOG_OUT](state) {
      state = defaultState;
    },
    [types.LOADING](state, isLoading) {
      state.loading = isLoading;
    },
    [types.SAVE_ROOM](state, roomName) {
      state.roomName = roomName;
    },
    [types.SAVE_TOPIC](state, payload) {
      state.topic = payload.topic;
      state.clues = payload.clues;
    },
    [types.ACTOR_NEXT](state, payload) {},
    [types.ACTOR_START](state, payload) {},
    [types.ACTOR_STOP](state, payload) {},
    [types.SELECT_WINNER](state, payload) {
      state.isActive = false;
      let actor = state.actors.find(f => f.streamId === payload.streamId);
      actor.points++;
    },
    [types.ACTOR_JOIN](state, payload) {
      if (!state.actors.some(f => f.streamId === payload.streamId)) {
        state.actors.push(payload);
      }
    },
    [types.ACTOR_PART](state, payload) {
      state.actors = state.actors.filter(f => f.streamId !== payload.streamId);
    }
  },
  actions: {
    async [types.USER_LOG_IN](context, payload) {
      context.commit(types.LOADING, true);
      context.commit(types.USER_LOG_IN, payload);
      context.commit(types.LOADING, false);
    },
    [types.USER_LOG_OUT](context) {
      context.commit(types.USER_LOG_OUT);
      context.commit(types.LOADING, false);
    },
    async [types.SAVE_ROOM](context, payload) {
      if (payload) {
        context.commit(types.SAVE_ROOM, payload);
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
    },
    async [types.SAVE_TOPIC](context, topic) {
      const clues = (
        await axios.post(
          `${functionUrl}/GetClues`,
          {
            topic
          },
          {
            "Content-Type": "application/json"
          }
        )
      ).data.clues;

      const payload = {
        topic,
        clues
      };

      context.commit(types.SAVE_TOPIC, payload);
      context.dispatch(types.ACTOR_NEXT);
    },
    [types.ROUND_START](context) {
      // Randomly choose topic
      context.dispatch(types.SAVE_TOPIC, topic);
    },
    [types.ACTOR_NEXT](context) {
      // Increment to the next actor
      // Choose a random clue
    },
    [types.ACTOR_START](context) {
      // Start 1 min timer
      // isActive = true
    },
    [types.ACTOR_STOP](context) {
      // isActive = false
    },
    [types.SELECT_WINNER](context, payload) {
      context.commit(types.SELECT_WINNER, payload);
      context.dispatch(types.ACTOR_NEXT);
    },
    [types.ACTOR_JOIN](context, payload) {
      context.commit(types.ACTOR_JOIN, payload);
    },
    [types.ACTOR_PART](context, payload) {
      context.commit(types.ACTOR_PART, payload);
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
