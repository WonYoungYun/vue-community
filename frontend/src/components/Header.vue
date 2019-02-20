<template>
  <nav>
    <v-navigation-drawer persistent v-model="drawer" enable-resize-watcher fixed app>
      <v-toolbar flat class="transparent" color="blue lighten-5">
        <v-list class="pa-10">
          <v-list-tile>
            <v-list-tile-avatar>
              <img :src="$store.state.user.img">
            </v-list-tile-avatar>
            <v-list-tile-content class="title font-weight-bold">
              {{$store.state.user.name}}
              <div>({{$store.state.user.id}})</div>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <navbar :user-id="userId"></navbar>
    </v-navigation-drawer>
    <v-toolbar app class="blue">
      <v-toolbar-side-icon v-if="!drawer" @click.stop="drawer = !drawer" class="title white--text"></v-toolbar-side-icon>
      <v-btn v-else icon class="hidden-xs-only" @click="drawer = !drawer">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-menu>
        <v-toolbar-title slot="activator" class="white--text" @click="home">{{title}}</v-toolbar-title>
      </v-menu>
      <v-spacer></v-spacer>

      <template v-if="!$store.state.token">
        <v-list-tile @click="$router.push('/sign')">
          <v-list-tile-title class="subheading font-weight-bold white--text">로그인</v-list-tile-title>
        </v-list-tile>
        <v-btn
          @click="$router.push('/register')"
          class="subheading font-weight-bold blue--text"
        >회원가입</v-btn>
      </template>

      <template v-else>
        <v-btn color="error" @click="signOut">로그아웃</v-btn>
      </template>
    </v-toolbar>
    <scroll-up></scroll-up>
  </nav>
</template>

<script>
import Navbar from "./Navbar.vue";

export default {
  name: "App",
  components: { Navbar },
  mounted() {
    //새로 고침 할때마다 데이터를 받아온다.
    if (localStorage.getItem("token")) {
      this.$axios
        .get(`${this.$apiRootPath}user`)
        .then(r => {
          if (!r.data.success) throw new Error(r.data.msg);
          this.$store.commit("getToken", r.data.userData);
          this.userId = r.data.userData._id;
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    }
  },
  data() {
    return {
      userId: "",
      drawer: null,
      title: "MEV5"
    };
  },
  methods: {
    home() {
      this.$router.push("/");
    },
    signOut() {
      this.$store.commit("delToken");
      this.$store.commit("pop", {
        msg: "로그아웃 하셨습니다.",
        color: "success"
      });
      this.$router.push("/");
    }
  }
};
</script>

<style>
</style>
