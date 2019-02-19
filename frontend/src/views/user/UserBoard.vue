<template>
  <v-container>
    <my-board :board="board" v-if="board" @getBoard="getBoard"></my-board>
    <template v-else>
      <v-container>
        <v-alert :value="true" type="warning">
          <span class="black--text">당신의 게시판이 없습니다! 새로만드세요!</span>
          <v-spacer></v-spacer>
          <v-btn round color="primary" dark @click="addDialog">게시판 만들기</v-btn>
        </v-alert>
        <v-flex xs12 sm4 text-xs-center></v-flex>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-card>
            <v-toolbar :color="form.color" dark>
              <v-toolbar-title>게시판 추가</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      label="게시판 이름"
                      hint="게시판의 이름"
                      counter="10"
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
                      counter="30"
                      persistent-hint
                      required
                      v-model="form.content"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-container>
                  <v-layout>
                    <v-flex class="text-xs-center">
                      <h4 class="grey--text">게시판 색상을 선택해주세요</h4>
                      <v-flex>
                        <v-chip color="black" @click="form.color=''"></v-chip>
                        <v-chip color="blue lighten-1" @click="form.color='blue lighten-1'"></v-chip>
                        <v-chip color="green lighten-1" @click="form.color='green lighten-1'"></v-chip>
                        <v-chip color="cyan dark-1" @click="form.color='cyan dark-1'"></v-chip>
                      </v-flex>
                    </v-flex>
                  </v-layout>
                </v-container>
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
  </v-container>
</template>
<script>
import MyBoard from "../../components/MyBoard.vue";
export default {
  components: { MyBoard },
  data() {
    return {
      board: {
        atcCnt: "", //게시글 수
        content: "",
        name: "",
        inCnt: "", //방문자 수
        color: "",
        _user: {
          id: ""
        }
      },
      dialog: false,
      form: {
        name: "",
        content: "",
        color: "" //기본색상
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
          console.log(this.board);
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
          this.form = { name: "", content: "", color: "" };
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

