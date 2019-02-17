<template>
  <v-app>
    <header-component></header-component>

    <v-content>
      <router-view/>
      <div class="text-xs-center mt-3" v-if="$store.state.isLoading">
        <v-progress-circular :size="70" :width="7" color="info" indeterminate></v-progress-circular>
      </div>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019 community</span>
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


