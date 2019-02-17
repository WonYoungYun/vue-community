<template>
  <nav>
    <v-navigation-drawer
      persistent
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
     <v-toolbar flat class="transparent" >
        <v-list class="pa-10">
          <v-list-tile>
            <v-list-tile-avatar>
              <img :src="$store.state.user.img">
            </v-list-tile-avatar>
            <v-list-tile-content class="title font-weight-bold">
              {{$store.state.user.name}}
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <navbar></navbar>
    </v-navigation-drawer>
    <v-toolbar app class="blue">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="title white--text"></v-toolbar-side-icon>
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
  </nav>
</template>

<script>
import Navbar from './Navbar.vue'
export default {
  name: "App",
  components:{Navbar},
  data() {
    return {
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
      this.$router.push("/");
    }
  }
};
</script>

<style>
</style>
