<template>
  <v-dialog v-model="dialog" max-width="700" :fullscreen="$vuetify.breakpoint.xs">
    <template>
      <v-card class="mx-auto" color="#f1f4f8">
        <v-toolbar color="#f1f4f8" v-if="!isMod">
          <v-btn icon @click="close">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title class="title font-weight-bold">{{article.title}}</v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card min-height="300px">
          <v-card-text class="headline" v-if="!isMod">
            <viewer :value="article.content"/>
          </v-card-text>
          <v-card-text v-else>
            <v-divider></v-divider>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="제목" required v-model="form.title"></v-text-field>
              </v-flex>
              <v-flex>
                <editor v-model="form.content" mode="wysiwyg"/>
              </v-flex>
            </v-layout>
            <small>*제목과 내용을 반드시 입력하세요</small>
          </v-card-text>
        </v-card>
        <v-card-actions v-if="$store.state.user.lv ? checkUser : true">
          <v-spacer></v-spacer>

          <div v-if="checkUser ">
            <v-btn flat color="warning" @click="setArticle" v-if="!isMod" :disabled="isDel">수정</v-btn>
            <v-btn flat color="error" @click="isMod = false" v-else>취소</v-btn>
          </div>
          <div>
            <v-btn flat color="error" v-if="!isMod" @click="isDel = true" :disabled="isDel">삭제</v-btn>
            <v-btn flat color="primary" v-else @click="putArticle">수정</v-btn>
          </div>
        </v-card-actions>
        <v-card-text v-if="isDel">
          <v-alert v-model="isDel" type="warning">
            <h4>정말 게시글을 삭제 하시겠습니까?</h4>
            <v-btn color="error" @click="delArticle">확인</v-btn>
            <v-btn color="secondary" @click="isDel=false">취소</v-btn>
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-list-tile class="grow">
            <v-list-tile-avatar color="grey darken-3">
              <v-img class="elevation-6" :src="article._user.img"></v-img>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{article._user.name}}({{article._user.id}})</v-list-tile-title>
            </v-list-tile-content>

            <v-layout align-center justify-end>
              <v-icon class="mr-1">visibility</v-icon>
              <span class="subheading mr-2">{{article.cnt.view}}</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1">sms</v-icon>
              <span class="subheading">{{article.cnt.comment}}</span>
            </v-layout>
          </v-list-tile>
        </v-card-actions>
        <!-- 댓글 -->
        <v-divider></v-divider>
        <div v-if="!isMod">
          <view-comments
            :article="article"
            :cmmts="article.comments"
            :cnt="article.cnt.comment"
            :artOpen="artOpen"
            :isModCmmt="isModCmmt"
            @getComments="getComments"
            @modCmmtOpen="modCmmtOpen"
            @modCmmtClose="modCmmtClose"
            @cmtOpen="cmtOpen"
            @cmtClose="cmtClose"
          ></view-comments>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>


<script>
import ViewComments from "./Comments.vue";

export default {
  props: ["dialog", "article"],
  components: { ViewComments },
  computed: {
    checkUser() {
      return this.article.req_user === this.article._user._id;
    }
  },
  data() {
    return {
      isMod: false,
      isDel: false,
      form: {
        title: "",
        content: "",
        id: ""
      },
      artOpen: false,
      isModCmmt: false
    };
  },
  methods: {
    setArticle() {
      this.isMod = true;
      this.form.title = this.article.title;
      this.form.content = this.article.content;
      this.form.id = this.article._user._id;
    },
    cmtOpen() {
      this.artOpen = true;
    },
    cmtClose() {
      this.isModCmmt = false;
      this.artOpen = false;
    },
    modCmmtOpen() {
      this.isModCmmt = true;
    },
    modCmmtClose() {
      this.isModCmmt = false;
    },
    putArticle() {
      this.$axios
        .put(`${this.$apiRootPath}article/${this.article._id}`, this.form)
        .then(({ data }) => {
          this.isMod = false;
          if (!data.success)
            return this.$store.commit("pop", {
              msg: data.message,
              color: "warning"
            });
          this.article.title = data.d.title;
          this.article.content = data.d.content;
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
    delArticle() {
      this.$axios
        .delete(`${this.$apiRootPath}article/${this.article._id}`)
        .then(() => {
          this.isDel = false;
          this.$store.commit("pop", {
            msg: "게시판 삭제 완료",
            color: "success"
          });
          this.$emit("closeAtc");
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    },
    getComments() {
      this.$emit("getArticle", this.article._id);
    },
    close() {
      this.artOpen = false;
      this.isModCmmt = false;
      this.$emit("closeAtc");
    }
  }
};
</script>

<style>
</style>
