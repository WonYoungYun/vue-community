<template>
  <v-card class="mx-auto" max-width="500">
    <v-toolbar :color="board.color" dark>
      <v-toolbar-title>{{board._user.id}}님의 게시판 정보</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-title>
      <span class="headline font-weight-bold">{{board.name}}</span>
      <v-layout align-center justify-end>
        <v-icon class="mr-1">person</v-icon>
        <span class="title mr-2">{{board.inCnt}}</span>
        <span class="mr-1">·</span>
        <v-icon class="mr-1">create</v-icon>
        <span class="title">{{board.atcCnt}}</span>
      </v-layout>
    </v-card-title>

    <v-divider></v-divider>
    <v-card-text class="subheading font-weight-bold">
      <v-flex>
        <div>
          <v-container>
            <div>{{board.content}}</div>
          </v-container>
          <v-flex align-right>
            <v-btn color="primary" flat @click="$router.push(`/board/${board.name}`)">바로가기</v-btn>
          </v-flex>
          <v-divider></v-divider>
          <v-container>
            <div>생성일: {{board.regDate}}</div>
          </v-container>
        </div>
      </v-flex>
    </v-card-text>

    <v-card-actions>
      <template v-if="!delBoardAlert">
        <v-spacer></v-spacer>
        <v-btn color="success" flat>수정</v-btn>
        <v-btn color="error" flat @click="delBoardAlert= true">삭제</v-btn>
      </template>
      <template v-else>
        <div class="red--text pl-2">정말 삭제하시겠습니까?</div>
        <v-spacer></v-spacer>
        <v-btn color="warning" @click="delBoard(board._id)">확인</v-btn>
        <v-btn color="primary" @click="delBoardAlert = false">취소</v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["board"],
  data() {
    return {
      delBoardAlert: false
    };
  },
  methods: {
    delBoard(id) {
      this.$axios
        .delete(`board/${id}`)
        .then(() => {
          this.$store.commit("pop", {
            msg: "게시판 삭제 완료",
            color: "success"
          });
          this.$emit("getBoard");
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        })
        .finally(() => {
          this.delBoardId = "";
          this.isDelBoard = false;
        });
    }
  }
};
</script>

<style>
</style>
