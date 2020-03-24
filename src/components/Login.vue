<template>
  <div>
    <div>
      <label for="username">Your Name</label>
      <input type="text" id="username" v-model="username" />
    </div>
    <div>
      <button v:disabled="username.length === 0" type="button" @click="connect">
        Join Game
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  props: {
    roomName: String
  },
  data: function() {
    return {
      room: "",
      sessionId: "",
      token: "",
      isConnecting: false,
      username: ""
    };
  },
  mounted() {
    // If the route didn't provide the
    // room name, then generate a random
    // one here.
    if (this.roomName !== undefined) {
      this.room = this.roomName;
    } else {
      this.room = this.makeid(15);
    }
  },
  methods: {
    async connect() {
      this.isConnecting = true;
      const functionUrl = process.env.VUE_APP_FUNCTION_URL;

      // Get the session for the code provided
      if (this.room) {
        try {
          const sessionData = (
            await this.$http.post(`${functionUrl}GetSession`, {
              sessionName: this.room
            })
          ).data;

          this.sessionId = sessionData.sessionId;

          const tokenData = (
            await this.$http.post(`${functionUrl}GetToken`, {
              sessionId: this.sessionId,
              userName: this.username
            })
          ).data;

          this.token = tokenData.token;

          this.$store
            .dispatch("login", {
              roomName: this.room,
              sessionId: this.sessionId,
              token: this.token
            })
            .then(() => {
              this.$router.push({ path: "/Room" });
            });
        } catch (err) {
          console.log(err);
          this.isConnecting = false;
        }
      }
    },
    makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
  }
};
</script>

<style></style>
