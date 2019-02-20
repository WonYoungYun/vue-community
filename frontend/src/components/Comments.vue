<template>
  <v-card>
    <v-container v-if="artOpen">
      <v-card class="mx-auto" color="#f1f4f8">
        <v-card-title>
          <v-avatar :tile="false">
            <img :src="comment._user.img">
          </v-avatar>
          <span class="headline font-weight-bold ml-3">
            {{comment._user.name}}
            <small class="grey--text">({{comment._user.id}})</small>
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="$emit('cmtClose')" color="grey lighten-2">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="title font-weight-bold px-5" v-if="!isModCmmt">{{comment.content}}</v-card-text>
        <v-card-text class="title font-weight-bold px-5" v-else>
          <v-text-field v-model="modContent" :disabled="!$store.state.user._id" required></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-list-tile class="grow" v-if="checkWriter">
            <v-layout align-center justify-end v-if="!isModCmmt">
              <v-btn icon class="mr-1">
                <v-icon color="primary" @click="$emit('modCmmtOpen')">create</v-icon>
              </v-btn>
              <v-btn icon class="mr-1">
                <v-icon color="error" @click="delComment">delete</v-icon>
              </v-btn>
            </v-layout>
            <v-layout align-center justify-end v-else>
              <v-btn icon class="mr-1">
                <v-icon color="error" @click="$emit('modCmmtClose')">close</v-icon>
              </v-btn>
              <v-btn icon class="mr-1">
                <v-icon color="primary" @click="putComment">create</v-icon>
              </v-btn>
            </v-layout>
          </v-list-tile>
        </v-card-actions>
      </v-card>
    </v-container>
    <template v-else>
      <v-list two-line>
        <template v-for="item in cmmts">
          <v-list-tile :key="item._id" avatar ripple @click="showComment(item)">
            <v-list-tile-avatar>
              <img :src="item._user.img">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item._user.name }}
                <small>({{ item._user.id }})</small>
              </v-list-tile-title>
              <v-list-tile-sub-title>{{ item.content }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-list-tile-action-text>{{ checkTime(item.regDate) }}</v-list-tile-action-text>
            </v-list-tile-action>
          </v-list-tile>
        </template>

        <template v-for="item in newCmmts">
          <v-list-tile :key="item._id" avatar ripple @click="showComment(item)">
            <v-list-tile-avatar>
              <img :src="item._user.img">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item._user.name }}
                <small>({{ item._user.id }})</small>
              </v-list-tile-title>
              <v-list-tile-sub-title>{{ item.content }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-list-tile-action-text>{{ checkTime(item.regDate) }}</v-list-tile-action-text>
            </v-list-tile-action>
          </v-list-tile>
        </template>
        <v-flex class="text-xs-center">
          <v-btn flat v-if="cnt>total" @click="getComments">더보기</v-btn>
          <span class="grey--text" v-else>더 이상 댓글이 없습니다</span>
        </v-flex>
      </v-list>
      <v-flex xs12 sm8 offset-sm2 pb-5>
        <v-card-text>
          <v-text-field
            v-model="content"
            :label="checkUser"
            append-icon="message"
            @keyup.enter="addComment"
            @click:append="addComment"
            :disabled="!$store.state.user._id"
          ></v-text-field>
        </v-card-text>
      </v-flex>
    </template>
  </v-card>
</template>

<script>
export default {
  props: ["article", "cmmts", "cnt", "artOpen", "isModCmmt"],
  data() {
    return {
      selected: [2],
      comment: {
        _user: {
          img: ""
        }
      },
      content: "",
      newCmmts: [],
      isLoading: false,
      total: 8,
      modContent: "",
      params: {
        page: 1
      }
    };
  },
  computed: {
    checkUser() {
      return this.$store.state.user._id
        ? "댓글"
        : "댓글을 다시려면 로그인 해주세요";
    },
    checkWriter() {
      return this.$store.state.user._id === this.comment._user._id;
    }
  },

  methods: {
    showComment(cmmt) {
      this.comment = cmmt;
      this.modContent = this.comment.content;
      this.$emit("cmtOpen");
    },
    getComments() {
      if (this.isLoading) return;
      this.$axios
        .get(`${this.$apiRootPath}comment/list/${this.cmmts[0]._article}`, {
          params: this.params
        })
        .then(({ data }) => {
          if (!data.success)
            return this.$store.commit("pop", {
              msg: data.msg,
              color: "warning"
            });
          this.newCmmts = data.ds;
          this.total = data.ct;
          this.loading = false;
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
          this.loading = false;
        });
    },
    addComment() {
      this.content = this.content.trim();
      if (!this.content)
        return this.$store.commit("pop", {
          msg: "내용을 작성해 주세요",
          color: "warning"
        });
      this.$axios
        .post(`${this.$apiRootPath}comment/${this.article._id}`, {
          content: this.content
        })
        .then(() => {
          this.$store.commit("pop", {
            msg: "댓글이 작성되었습니다.",
            color: "success"
          });
          this.$emit("getComments");
          this.content = "";
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    },
    putComment() {
      if (this.modContent === this.comment.content) return;
      this.modContent = this.modContent.trim();
      if (!this.modContent) return;
      this.$axios
        .put(`${this.$apiRootPath}comment/${this.comment._id}`, {
          content: this.modContent
        })
        .then(({ data }) => {
          if (!data.success)
            return this.$store.commit("pop", {
              msg: data.message,
              color: "warning"
            });
          this.$emit("modCmmtClose");
          this.$emit("getComments");
          this.$emit("cmtClose");
          this.modContent = ""
          this.$store.commit("pop", {
            msg: "게시글을 수정완료.",
            color: "primary"
          });
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    },
    delComment() {
      console.log("댓글 삭제");
    },
    checkTime(time) {
      return this.$moment(time).fromNow();
    }
  }
};
</script>

<style>
</style>
