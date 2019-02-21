<template>
  <v-app>
    <header-component></header-component>

    <v-content>
      <router-view :key="$route.fullPath"/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy;윤원영. - 2019 M.E.V community</span>
    </v-footer>

    <v-snackbar v-model="$store.state.sb.act" :color="$store.state.sb.color">
      {{ $store.state.sb.msg }}
      <v-btn flat @click="$store.commit('pop', { act: false })">닫기</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import HeaderComponent from "./components/Header.vue";

export default {
  name: "App",
  components: { HeaderComponent },
  data() {
    return {
      fixed: false
    };
  }
};
</script>


