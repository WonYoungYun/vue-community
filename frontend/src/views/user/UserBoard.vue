<template>
  <v-container>
    <template v-if="!board">
      <v-container>
        <v-alert :value="true" type="warning">
          <span class="black--text">당신의 게시판이 없습니다! 새로만드세요!</span>
          <v-spacer></v-spacer>
          <v-btn round color="primary" dark @click="addDialog">게시판 만들기</v-btn>
        </v-alert>
        <v-flex xs12 sm4 text-xs-center></v-flex>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">게시판 추가</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      label="게시판 이름"
                      hint="게시판의 이름"
                      persistent-hint
                      required
                      v-model="form.name"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12>
                    <v-text-field
                      label="게시판 설명"
                      hint="게시판의 컨텐츠를 작성해주세요."
                      persistent-hint
                      required
                      v-model="form.content"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="addBoard">확인</v-btn>
              <v-btn color="red darken-1" flat @click.native="dialog = false">취소</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
    <v-card class="mx-auto" color="#777" max-width="500" v-else dark>
      <v-card-title>
        <span class="headline font-weight-bold">{{board._user.id}}님의 게시판 정보</span>
      </v-card-title>

      <v-divider></v-divider>
      <v-card-text class="subheading font-weight-bold">
        <v-flex>
          <div>
            <h3 class="headline mb-0">{{board.name}}</h3>
            <v-layout align-center justify-end>
              <v-icon class="mr-1">person</v-icon>
              <span class="title mr-2">{{board.inCnt}}</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1">create</v-icon>
              <span class="title">{{board.atcCnt}}</span>
            </v-layout>
            <v-container>
              <div>{{board.content}}</div>
            </v-container>
            <v-container>
              <div>생성일: {{board.regDate}}</div>
            </v-container>
          </div>
        </v-flex>
        <v-btn color="primary" @click="$router.push(`/board/${board.name}`)">바로가기</v-btn>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success">수정</v-btn>
        <v-btn color="error">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      board: {
        atcCnt: "", //게시글 수
        content: "",
        name: "",
        inCnt: "", //방문자 수
        _user: {
          id: ""
        }
      },
      dialog: false,
      form: {
        name: "",
        content: ""
      }
    };
  },
  mounted() {
    this.getBoard();
    //이 화면에서 CRUD가 다 이루어져야 한다.
  },
  methods: {
    addDialog() {
      this.dialog = true;
    },
    getBoard() {
      this.$axios
        .get(`${this.$apiRootPath}board/`)
        .then(r => {
          this.board = r.data.d;
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    },
    addBoard() {
      if (!this.form.name)
        return this.$store.commit("pop", {
          msg: "게시판 이름을 작성하세요",
          color: "warning"
        });
      this.$axios
        .post("board", this.form)
        .then(() => {
          this.dialog = false;
          this.getBoard();
        })
        .catch(e => {
          if (!e.response)
            return this.$store.commit("pop", {
              msg: e.message,
              color: "warning"
            });
        });
    }
  }
};
</script>

