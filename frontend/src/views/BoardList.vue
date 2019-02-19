<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm6 md3 v-for="board in boards" :key="board._id">
        <v-hover>
          <v-card
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`"
            class="mx-auto"
            max-width="400"
          >
            <v-toolbar :color="board.color" dark>
              <v-toolbar-title>{{board.name}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <span class="yellow--text">{{board._user.name}}({{board._user.id}})</span>
            </v-toolbar>
            <v-card-title primary-title>{{board.content}}</v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
              <v-icon class="mr-1">person</v-icon>
              <span class="title mr-2">{{board.inCnt}}</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1">create</v-icon>
              <span class="title">{{board.atcCnt}}</span>
              <v-spacer></v-spacer>
              <v-btn color="black" flat class="mr-0" @click="$router.push(`board/${board.name}`)">
                <v-icon>arrow_right_alt</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      boards: []
    };
  },
  mounted() {
    this.getBoards();
  },
  methods: {
    getBoards() {
      this.$axios
        .get(`${this.$apiRootPath}board/list`)
        .then(r => {
          this.boards = r.data.ds;
          console.log(this.boards);
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    }
  }
};
</script>

<style>
</style>
