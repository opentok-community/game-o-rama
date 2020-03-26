<template>
  <div>
    <h1>Game-o-rama Room</h1>
    <p>
      <a :href="roomLink" target="_blank">{{roomLink}}</a>
    </p>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "Room",
  computed: {
    room() {
      return this.$store.state.roomName;
    },
    url() {
      return `${window.location.protocol}${window.location.hostname}`;
    },
    roomLink() {
      return `${this.url}/${this.room}`;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
