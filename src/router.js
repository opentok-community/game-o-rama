import Vue from "vue";
import Router from "vue-router";
import { roomGuard } from "@/guards/roomGuard";

import Home from "@/views/Home.vue";
import Room from "@/views/Room.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      props: route => ({
        roomName: route.query.room
      }),
      component: Home
    },
    {
      path: "/Room/:roomName",
      name: "Room",
      component: Room,
      beforeEnter: roomGuard
    }
  ]
});
