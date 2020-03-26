<template>
  <div>
    <h3>Charades</h3>
    <p style="text-align:center;">
      <button @click="startGame">Start Game</button>
    </p>
    <Session />
  </div>
</template>

<script>
import Session from "@/components/Session";
import * as types from "@/state/Mutations";

export default {
  name: "Lobby",
  components: {
    Session
  },
  computed: {
    room() {
      return this.$store.state.roomName;
    }
  },
  methods: {
    startGame() {
      this.$store.dispatch(types.GAME_START).then(() => {
        this.$router.push({ path: `/${this.room}/charades` });
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
