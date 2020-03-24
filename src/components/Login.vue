<template>
  <div>
    <div>
      <label for="name">Your Name</label>
      <input type="text" id="name" />
    </div>
    <div>
      <button type="button">Join Game</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  props: {
      isConnecting: false,
      room: undefined,
      sessionId: undefined,
      token: undefined
  },
  methods: {
      async connect() {
          this.isConnecting = true;

          // Get the session for the code provided
          if (room) {
              try {
              const sessionResponse = await this.$http.post(`${functionurl}/GetSession`, {
                  sessionName: room
              });

              }
              catch (err) {

              }


          }


          // Get a token specific to this user for the session

          // Route the user to the session with their token
      }
  }:
};
</script>

<style></style>
