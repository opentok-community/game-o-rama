import Vue from "vue";
import Router from "vue-router";
import { roomGuard } from "@/guards/roomGuard";

import Home from "@/views/Home.vue";
import Lobby from "@/views/Lobby.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/:roomName?",
      name: "Home",
      props: route => ({
        roomName: route.params.roomName
      }),
      component: Home
    },
    {
      path: "/:roomName/lobby",
      name: "Lobby",
      component: Lobby,
      beforeEnter: roomGuard
    }
  ]
});
