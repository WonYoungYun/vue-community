<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <view-article :dialog="isViewAtc" :article="article" @closeAtc="list" @getArticle="getAtc"></view-article>
        <v-card>
          <v-layout column fill-height>
            <v-toolbar :color="board.color" dark>
              <v-btn icon to="/">
                <v-icon>arrow_back</v-icon>
              </v-btn>
              <v-toolbar-title class="font-weight-bold">{{board.name}}</v-toolbar-title>
            </v-toolbar>

            <v-card-title class="black--text">
              <div class="title px-1 py-2 font-italic">{{board.content}}</div>
            </v-card-title>
            <v-divider></v-divider>
          </v-layout>
          <v-list subheader>
            <v-subheader>게시글</v-subheader>
            <v-list-tile v-for="(item,idx) in articles" :key="idx" avatar>
              <v-list-tile-avatar>
                <span>{{total-idx}}</span>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  <a @click="getAtc(item._id)">{{ item.title }}</a>
                </v-list-tile-title>
                <v-list-tile-sub-title class="grey--text">{{ item.regDate }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-list-tile-action-text>{{item.cnt.view}}</v-list-tile-action-text>
                <v-icon>visibility</v-icon>
              </v-list-tile-action>

              <v-list-tile-action>
                <v-list-tile-action-text>{{item.cnt.comment}}</v-list-tile-action-text>
                <v-icon>sms</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <div v-if="checkUser">
            <add-article :boardId="board._id" @list="list"></add-article>
          </div>
          <v-flex class="text-xs-center">
            <span class="grey--text" v-if="checkLastPage">더 이상 페이지가 없습니다</span>
            <v-btn @click="getNextArticles" :disabled="isLoadNextArticle" v-else flat>더보기</v-btn>
          </v-flex>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AddArticle from "../../components/AddArticle.vue";
import ViewArticle from "../../components/Article.vue";

export default {
  components: {
    AddArticle,
    ViewArticle
  },
  computed: {
    checkUser() {
      return this.board._user === this.reqUser;
    },
    checkLastPage() {
      return this.total === this.articles.length;
    }
  },
  watch: {
    $route() {
      this.getBoard();
    }
  },
  data() {
    return {
      articles: [],
      article: {
        title: "",
        content: "",
        _user: {},
        cnt: {}
      },
      reqUser: "",
      board: {
        name: "",
        content: ""
      },
      params: {
        page: 1
      },
      cmtPage: 1,
      isLoadNextArticle: false,
      isAddArticle: false,
      total: 0,
      isViewAtc: false
    };
  },
  mounted() {
    this.getBoard();
  },
  destroyed() {},
  methods: {
    list() {
      this.isViewAtc = false;
      if (!this.board._id) return;
      this.isLoadNextArticle ? (this.params.page += 1) : (this.params.page = 1);

      this.loading = true;
      this.$axios
        .get(`${this.$apiRootPath}article/list/${this.board._id}`, {
          params: this.params
        })
        .then(({ data }) => {
          if (!data.success)
            return this.$store.commit("pop", {
              msg: data.msg,
              color: "warning"
            });
          if (this.isLoadNextArticle) {
            this.articles = this.articles.concat(data.ds);
            this.isLoadNextArticle = false;
          } else {
            this.articles = data.ds;
          }
          this.total = data.t;
          this.loading = false;
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
          this.loading = false;
        });
    },
    getBoard() {
      this.$axios
        .get(`${this.$apiRootPath}board/read/${this.$route.params.name}`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg);
          this.board = data.d;
          this.reqUser = data.req_user;
          this.list();
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    },
    getNextArticles() {
      this.isLoadNextArticle = true;
      this.list();
    },
    getAtc(id) {
      this.isViewAtc = true;
      this.$axios.get(`${this.$apiRootPath}/article/read/${id}`).then(r => {
        this.article = { ...r.data.d, req_user: r.data.req_user };
      });
    }
  }
};
</script>

<style>
a {
  text-decoration: none;
}
</style>
