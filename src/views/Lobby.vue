<template>
  <div>
    <h1>Game-o-rama Room {{room}}</h1>
    <Session />
  </div>
</template>

<script>
import Session from "@/components/Session";

export default {
  name: "Lobby",
  components: {
    Session
  },
  computed: {
    room() {
      return this.$store.state.roomName;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
