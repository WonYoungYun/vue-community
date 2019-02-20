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
        <v-btn color="success" flat @click="setBoard">수정</v-btn>
        <v-btn color="error" flat @click="delBoardAlert= true">삭제</v-btn>
      </template>
      <template v-else>
        <div class="red--text pl-2">정말 삭제하시겠습니까?</div>
        <v-spacer></v-spacer>
        <v-btn color="warning" @click="delBoard(board._id)">확인</v-btn>
        <v-btn color="primary" @click="delBoardAlert = false">취소</v-btn>
      </template>
    </v-card-actions>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">게시판 내용변경</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="이름"
                  hint="게시판 이름 변경"
                  persistent-hint
                  required
                  v-model="putBoard.name"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="내용"
                  hint="게시판 내용 변경"
                  persistent-hint
                  required
                  v-model="putBoard.content"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-container>
            <v-flex>
              <div class="grey--text">게시판 색상 변경</div>
              <v-chip color="black" @click="putBoard.color=''"></v-chip>
              <v-chip color="blue lighten-1" @click="putBoard.color='blue lighten-1'"></v-chip>
              <v-chip color="green lighten-1" @click="putBoard.color='green lighten-1'"></v-chip>
              <v-chip color="cyan dark-1" @click="putBoard.color='cyan dark-1'"></v-chip>
            </v-flex>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="updateBoard">수정</v-btn>
          <v-btn color="blue darken-1" flat @click="dialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  props: ["board"],
  data() {
    return {
      putBoard: {
        name: "",
        content: "",
        putBoard: ""
      },
      dialog: false,
      delBoardAlert: false
    };
  },
  methods: {
    setBoard() {
      this.putBoard.name = this.board.name;
      this.putBoard.content = this.board.content;
      this.putBoard.color = this.board.color;
      this.dialog = true;
    },
    updateBoard() {
      this.putBoard.name = this.putBoard.name.trim();
      if (
        this.putBoard.name === this.board.name &&
        this.putBoard.content === this.board.content &&
        this.putBoard.color === this.board.color
      )
        return this.$store.commit("pop", {
          msg: "수정한 내용이 없습니다.",
          color: "warning"
        });

      if (!this.putBoard.name)
        return this.$store.commit("pop", {
          msg: "게시판 이름은 반드시 입력해야 합니다.",
          color: "warning"
        });
      this.$axios
        .put(`${this.$apiRootPath}board/${this.board._id}`, {
          name: this.putBoard.name,
          content: this.putBoard.content,
          color: this.putBoard.color
        })
        .then(() => {
          this.$store.commit("pop", {
            msg: "게시판 수정 완료",
            color: "success"
          });
          this.$emit("getBoard");
          this.dialog = false;
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    },
    delBoard(id) {
      this.$axios
        .delete(`${this.$apiRootPath}board/${id}`)
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
