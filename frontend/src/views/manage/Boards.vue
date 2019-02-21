<template>
  <v-container grid-list-md>
    <v-alert :value="!boards" type="warning">데이터가 없습니다</v-alert>
    <v-card>
      <v-card-title class="headline font-weight-bold">게시판
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="게시판 이름으로 검색"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <div>
        <v-progress-linear v-if="isLoading" slot="progress" color="blue" indeterminate></v-progress-linear>
      </div>
      <v-data-table :headers="headers" :items="boards" :search="search">
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{props.item._user.name}}({{ props.item._user.id }})</td>
          <td class="text-xs-center">{{ props.item.regDate }}</td>
          <td class="text-xs-center">{{ props.item.atcCnt }}</td>
          <td class="text-xs-center">{{ props.item.inCnt }}</td>
          <td class="text-xs-center">
            <v-btn color="error" @click="checkDelBoard(props.item._id)">삭제</v-btn>
          </td>
        </template>

        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >"{{ search }}" 의 검색결과가 없습니다.</v-alert>
      </v-data-table>
      <v-dialog v-model="isDelBoard" max-width="320">
        <v-card>
          <v-card-title class="title">정말 삭제 하시겠습니까?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" flat="flat" @click="isDelBoard = false">아니요</v-btn>

            <v-btn color="red darken-1" flat="flat" @click="delBoard(delBoardId)">네</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "게시판 이름",
          align: "center",
          value: "name"
        },
        {
          text: "게시판 소유자",
          value: "_user.id",
          align: "center",
          sortable: false
        },
        { text: "게시판 생성일", align: "center", value: "regDate" },
        { text: "게시글 수", align: "center", value: "atcCnt" },
        { text: "방문 횟수", align: "center", value: "inCnt" },
        {
          text: "게시판 삭제",
          align: "center",
          value: ""
        }
      ],
      dialog: false,
      isDelBoard: false,
      isLoading: true,
      delId: "",

      boards: []
    };
  },

  mounted() {
    this.isLoading = true;
    this.getBoards();
  },
  methods: {
    getBoards() {
      this.$axios
        .get(`${this.$apiRootPath}board/list`)
        .then(r => {
          this.boards = r.data.ds;
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    checkDelBoard(_id) {
      this.delBoardId = _id;
      this.isDelBoard = true;
    },
    delBoard(id) {
      this.$axios
        .delete(`${this.$apiRootPath}board/${id}`)
        .then(() => {
          this.$store.commit("pop", {
            msg: "게시판 삭제 완료",
            color: "success"
          });
          this.getBoards();
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