<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-layout column fill-height>
            <v-toolbar :color="board.color" dark>
              <v-btn icon @click="$router.push('/')">
                <v-icon>arrow_back</v-icon>
              </v-btn>
              <v-toolbar-title class="font-weight-bold">{{board.name}}</v-toolbar-title>
            </v-toolbar>

            <v-card-title class="black--text">
              <div class="title px-1 py-2 font-italic">{{board.content}}</div>
            </v-card-title>
            <v-divider></v-divider>
          </v-layout>
          <v-list two-line>
            <template v-for="(item, index) in items">
              <v-list-tile :key="item.index" avatar ripple>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
            </template>
            <v-btn color="cyan" dark fixed bottom right fab large>
              <v-icon>add</v-icon>
            </v-btn>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  watch: {
    $route() {
      // console.log(to.path, from.path)
      this.getBoard();
    }
  },
  data() {
    return {
      items: [
        {
          action: "15 min",
          headline: "Brunch this weekend?",
          title: "Ali Connors",
          subtitle:
            "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        {
          action: "2 hr",
          headline: "Summer BBQ",
          title: "me, Scrott, Jennifer",
          subtitle: "Wish I could come, but I'm out of town this weekend."
        },
        {
          action: "15 min",
          headline: "Brunch this weekend?",
          title: "Ali Connors",
          subtitle:
            "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        {
          action: "2 hr",
          headline: "Summer BBQ",
          title: "me, Scrott, Jennifer",
          subtitle: "Wish I could come, but I'm out of town this weekend."
        },
        {
          action: "15 min",
          headline: "Brunch this weekend?",
          title: "Ali Connors",
          subtitle:
            "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        {
          action: "2 hr",
          headline: "Summer BBQ",
          title: "me, Scrott, Jennifer",
          subtitle: "Wish I could come, but I'm out of town this weekend."
        }
      ],
      board: {
        name: "",
        content: ""
      }
    };
    //api id를 호출
  },
  mounted() {
    this.getBoard();
  },
  methods: {
    getBoard() {
      this.$axios
        .get(`board/read/${this.$route.params.name}`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg);
          this.board = data.d;
          //게시글 리스트 출력
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    }
  }
};
</script>

