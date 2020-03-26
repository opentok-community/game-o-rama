import Vue from "vue";
import Router from "vue-router";
import { roomGuard } from "@/guards/roomGuard";

import Home from "@/views/Home.vue";
import Room from "@/views/Room.vue";
import Lobby from "@/views/Lobby.vue";
import Charades from "@/views/Charades.vue";

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
      path: "/:roomName",
      component: Room,
      beforeEnter: roomGuard,
      children: [
        {
          path: "",
          component: Lobby,
          name: "Room"
        },
        {
          path: "lobby",
          component: Lobby,
          name: "Lobby"
        },
        {
          path: "charades",
          component: Charades,
          name: "Charades"
        }
      ]
    }
  ]
});
