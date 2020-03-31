<template>
  <div>
    <h3>Charades</h3>
    <p style="text-align:center;"></p>
    <Session />
  </div>
</template>

<script>
import Session from "@/components/Session";
// import * as types from "@/state/Mutations";

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
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
