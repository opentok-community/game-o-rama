<template>
  <div>
    <h1>Game-o-rama</h1>
    <Login v-bind:roomName="roomName" />
  </div>
</template>

<script>
import Login from "@/components/Login";

export default {
  name: "Home",
  props: {
    roomName: String
  },
  components: {
    Login
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
