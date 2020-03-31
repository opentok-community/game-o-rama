<template>
  <div id="session" @error="errorHandler">
    <publisher :session="session" @error="errorHandler"></publisher>
    <div id="subscribers" v-for="stream in streams" :key="stream.streamId">
      <subscriber @error="errorHandler" :stream="stream" :session="session"></subscriber>
    </div>
  </div>
</template>

<script>
import OT from "@opentok/client";
import Publisher from "./Publisher.vue";
import Subscriber from "./Subscriber.vue";
import * as types from "@/state/Mutations";

const errorHandler = err => {
  alert(err.message);
};

const apiKey = process.env.VUE_APP_OPENTOK_APIKEY;

export default {
  name: "session",
  components: { Publisher, Subscriber },
  computed: {
    sessionId() {
      return this.$store.state.sessionId;
    },
    token() {
      return this.$store.state.token;
    }
  },
  created() {
    this.session = OT.initSession(apiKey, this.sessionId);

    this.$store.dispatch(types.SESSION_JOIN, { session: this.session });

    this.session.connect(this.token, err => {
      if (err) {
        errorHandler(err);
      }
    });

    this.session.on(`signal:${types.GAME_INIT}`, () => {
      this.$store.dispatch(types.GAME_START).then(() => {
        this.$router.push({ path: `/${this.$store.state.roomName}/charades` });
      });
    });

    this.session.on("streamCreated", event => {
      this.streams.push(event.stream);
      this.$store.dispatch(types.ACTOR_JOIN, {
        streamId: event.stream.streamId
      });
    });
    this.session.on("streamDestroyed", event => {
      const idx = this.streams.indexOf(event.stream);
      if (idx > -1) {
        this.streams.splice(idx, 1);
      }
      this.$store.dispatch(types.ACTOR_PART, {
        streamId: event.stream.streamId
      });
    });
  },
  data: () => ({
    streams: [],
    session: null
  }),
  methods: {
    errorHandler
  }
};
</script>

<style>
.OT_subscriber {
  float: left;
}
.OT_publisher {
  float: left;
}
</style>
