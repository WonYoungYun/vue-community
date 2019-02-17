<template>
  <v-container grid-list-md>
    <v-card>
      <v-card-title class="title font-weight-bold">유저 현황
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="유저 아이디로 검색"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="users" :search="search">
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.lv }}</td>
          <td class="text-xs-center">{{ props.item.regDate }}</td>
          <td class="text-xs-center">{{ props.item.blocked }}</td>
          <td class="text-xs-center">
            <v-btn color="info" @click="putDialog(props.item)">수정</v-btn>
            <v-btn color="error" @click="checkDelUser(props.item._id)">삭제</v-btn>
          </td>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >Your search for "{{ search }}" found no results.</v-alert>
      </v-data-table>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">유저 상세보기</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="이름" hint="휴먼" persistent-hint required v-model="user.name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select :items="userLvs" label="권한" required v-model="user.lv"></v-select>
                </v-flex>
              </v-layout>
            </v-container>
            <v-container fluid>
              <v-switch v-model="user.blocked" :label="`blocked: ${user.blocked.toString()}`"></v-switch>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="putUser">수정</v-btn>
            <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isDelUser" max-width="320">
        <v-card>
          <v-card-title class="title">정말 삭제 하시겠습니까?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" flat="flat" @click="isDelUser = false">아니요</v-btn>

            <v-btn color="red darken-1" flat="flat" @click="delUser(delId)">네</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
export default {
  mounted() {
    this.$store.commit("loading");
    this.getUsers();
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "유저 아이디",
          align: "left",
          sortable: false,
          value: "id"
        },
        { text: "유저 이름", value: "name", sortable: false },
        { text: "유저 권한", value: "lv" },
        { text: "유저 생성일", value: "regDate" },
        { text: "계정상태(blocked)", value: "blocked" },
        {
          text: "계정 수정 및 삭제",
          value: ""
        }
      ],
      users: [],
      dialog: false,
      userLvs: [0, 1, 2, 3],
      user: {
        id: "",
        name: "",
        lv: 0,
        blocked: false
      },
      isDelUser: false,
      delId: ""
    };
  },
  methods: {
    getUsers() {
      this.$axios
        .get("manage/users")
        .then(r => {
          this.users = r.data.users;
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        })
        .finally(() => {
          this.$store.commit("loading");
        });
    },
    putDialog(user) {
      this.dialog = true;
      this.user.id = user._id;
      this.user.name = user.name;
      this.user.lv = user.lv;
      this.user.block = user.blocked;
    },
    putUser() {
      this.dialog = false;
      this.$axios
        .put(`manage/users/${this.user.id}`, {
          name: this.user.name,
          lv: this.user.lv,
          blocked: this.user.blocked
        })
        .then(() => {
          this.$store.commit("pop", {
            msg: "사용자 수정 완료",
            color: "success"
          });
          this.getUsers();
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    },
    checkDelUser(_id) {
      this.delId = _id;
      this.isDelUser = true;
    },
    delUser(id) {
      this.$axios
        .delete(`manage/users/${id}`)
        .then(r => {
          this.$store.commit("pop", {
            msg: "사용자 삭제 완료",
            color: "success"
          });
          this.getUsers();
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        })
        .finally(() => {
          this.delId = "";
          this.isDelUser = false;
        });
    }
  }
};
</script>