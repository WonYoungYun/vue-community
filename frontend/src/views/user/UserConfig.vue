<template>
  <v-container fluid grid-list-md>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <my-profile :user="user"></my-profile>

        <v-container>
          <v-card class="hide-overflow" color="grey lighten-3">
            <v-toolbar card color="grey lighten-4">
              <v-icon>person</v-icon>
              <v-toolbar-title class="font-weight-light">유저정보 수정</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="white" fab small @click="isEditing = !isEditing">
                <v-icon v-if="isEditing">close</v-icon>
                <v-icon v-else>create</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  :disabled="!isEditing"
                  v-validate="'required|min:1|max:8'"
                  :counter="8"
                  color="black"
                  label="이름"
                  :error-messages="errors.collect('name')"
                  data-vv-name="name"
                  v-model="putName"
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-validate="'required|min:4|max:40'"
                  :counter="40"
                  data-vv-name="pwd"
                  color="black"
                  type="password"
                  label="비밀번호"
                  v-model="pwd.pwd"
                ></v-text-field>
              </v-form>
              <v-text-field
                :disabled="!isEditing"
                color="black"
                type="password"
                label="비밀번호 확인"
                v-model="pwd.check"
              ></v-text-field>
              <v-alert :value="isCheckPwd" type="error">비밀번호를 확인해주세요!</v-alert>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="!isEditing" color="success" @click="updateUser">저장하기</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
        <v-container>
          <v-card color="white lighten-1">
            <v-alert :value="true" type="warning">회원탈퇴</v-alert>
            <v-card-actions>
              <v-checkbox v-model="isDelUser" :label="`정말로 삭제하시겠습니까?`"></v-checkbox>

              <v-spacer></v-spacer>

              <v-btn :disabled="!isDelUser" color="warning" @click="delUser">유저탈퇴</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>



<script>
import ko from "vee-validate/dist/locale/ko";
import MyProfile from "../../components/MyProfile.vue";

export default {
  components: {
    MyProfile
  },
  $_veeValidate: {
    validator: "new"
  },
  data() {
    return {
      putName: "",
      pwd: {
        pwd: "",
        check: ""
      },
      user: {
        _id: "",
        name: "",
        id: "",
        lv: "",
        img: "",
        regDate: ""
      },
      dictionary: {
        messages: ko.messages,
        attributes: {
          name: "이름"
        },
        custom: {}
      },
      isEditing: false,
      isDelUser: false,
      isCheckPwd: false
    };
  },

  mounted() {
    this.$validator.localize("ko", this.dictionary);
    //저장소에 저장되어있는 유저정보가 아니라 완전한 유저정보 가져와야함  get api user
    this.getUser();
  },
  methods: {
    getUser() {
      this.$axios
        .get(`user`)
        .then(r => {
          this.user = r.data.userData;
          this.putName = this.user.name;
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    },
    updateUser() {
      if (this.pwd.check !== this.pwd.pwd) {
        this.isCheckPwd = true;
        this.pwd = { pwd: "", check: "" };
        return;
      }

      if (this.putName === this.user.name && this.pwd.check === "") return;

      let u = {};
      if (this.pwd.check === "") u = { name: this.putName };
      else
        u = {
          name: this.putName,
          pwd: this.pwd.pwd
        };
      this.$axios
        .put(`user/${this.user._id}`, u)
        .then(() => {
          this.$store.commit("pop", {
            msg: "사용자 수정 완료",
            color: "success"
          });
          this.getUser();
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        })
        .finally(() => {
          this.pwd = { pwd: "", check: "" };
          this.isEditing = false;
          this.isCheckPwd = false;
        });
    },
    delUser() {
      this.$axios
        .delete(`user/${this.user._id}`)
        .then(() => {
          this.$store.commit("pop", {
            msg: "사용자 삭제 완료",
            color: "success"
          });
          this.$store.commit("delToken");
          this.$router.push("/");
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    }
  }
};
</script>

