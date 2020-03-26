import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import * as types from "./Mutations";

Vue.use(Vuex);

const functionUrl = process.env.VUE_APP_FUNCTION_URL;
const numberOfRounds = 3;
const actorTime = 1000; // Milliseconds allowed per actor
let actorTimer;

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
    showResults: false,
    currentActor: -1,
    currentRound: 0,
    currentClue: "",
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
      state.sessionId = "";
      state.token = "";
      state.roomName = "";
      state.loading = false;
      state.isActive = false;
      state.topic = "";
      state.showResults = false;
      state.currentActor = -1;
      state.currentRound = 0;
      state.currentClue = "";
      state.usedClues = [];
      state.clues = [];
      state.actors = [];
    },
    [types.LOADING](state, isLoading) {
      state.loading = isLoading;
    },
    [types.SAVE_ROOM](state, roomName) {
      state.roomName = roomName;
    },
    [types.GAME_START](state) {
      state.clues = [];
      state.topic = "";
      state.isActive = false;
      state.currentRound = 0;
      state.currentActor = -1;
      state.showResults = false;
    },
    [types.GAME_END](state) {
      state.showResults = true;
    },
    [types.ROUND_START](state, payload) {
      state.topic = payload.topic;
      state.clues = payload.clues;
      state.currentRound++;
    },
    [types.ROUND_END](state) {
      state.currentActor = -1;
      state.isActive = false;
    },

    [types.ACTOR_NEXT](state, payload) {
      const nextActor = state.currentActor++;
      state.currentActor = nextActor >= state.actors.length ? 0 : nextActor;
      state.currentClue = payload.clue;
      state.clues = state.clues.filter(f => f !== payload.clue);
    },
    [types.ACTOR_START](state) {
      state.isActive = true;
    },
    [types.ACTOR_STOP](state) {
      state.isActive = false;
      state.currentClue = "";
    },
    [types.SELECT_WINNER](state, payload) {
      state.isActive = false;
      let actor = state.actors.find(f => f.streamId === payload.streamId);
      actor.points++;
      state.currentClue = "";
    },
    [types.ACTOR_JOIN](state, payload) {
      const isActorInState = state.actors.some(
        f => f.streamId === payload.streamId
      );
      if (!isActorInState) {
        payload.points = 0;
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
            `${functionUrl}GetRoomName`,
            {},
            {
              "Content-Type": "application/json"
            }
          )
        ).data.roomName;
        context.commit(types.SAVE_ROOM, room);
      }
    },
    [types.GAME_START](context) {
      context.commit(types.GAME_START);
      context.dispatch(types.ROUND_START);
    },
    [types.GAME_END](context) {
      context.commit(types.GAME_END);
    },
    async [types.ROUND_START](context) {
      const topic = (
        await axios.post(
          `${functionUrl}GetTopic`,
          {},
          {
            "Content-Type": "application/json"
          }
        )
      ).data.topic;

      const clues = (
        await axios.post(
          `${functionUrl}GetClues`,
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

      context.commit(types.ROUND_START, payload);
      context.dispatch(types.ACTOR_NEXT);
    },
    [types.ROUND_END](context) {
      if (this.state.currentRound < numberOfRounds) {
        context.commit(types.ROUND_END);
        context.dispatch(types.ROUND_START);
      } else {
        context.dispatch(types.GAME_END);
      }
    },
    [types.ACTOR_NEXT](context) {
      const clue = this.state.clues[
        Math.floor(Math.random() * this.state.clues.length)
      ];
      context.commit(types.ACTOR_NEXT, { clue });
    },
    [types.ACTOR_START](context, payload) {
      context.commit(types.ACTOR_START, payload);
      actorTimer = setTimeout(context => {
        context.dispatch(types.ACTOR_STOP);
      }, actorTime);
    },
    [types.ACTOR_STOP](context) {
      clearTimeout(actorTimer);
      actorTimer = undefined;
      context.commit(types.ACTOR_STOP);
      if (this.state.currentActor === this.state.actors.length - 1) {
        context.dispatch(types.ROUND_END);
      } else {
        context.dispatch(types.ACTOR_NEXT);
      }
    },
    [types.SELECT_WINNER](context, payload) {
      clearTimeout(actorTimer);
      actorTimer = undefined;
      context.commit(types.SELECT_WINNER, payload);
      context.dispatch(types.ACTOR_STOP);
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
