<template>
  <v-container>
    <v-card color="blue lighten-5">
      <v-container>
        <v-layout align-center justify-center>
          <v-flex xs6 text-xs-center>
            <v-avatar :tile="false" size="130" color="grey lighten-4">
              <img :src="user.img" alt="avatar">
            </v-avatar>
            <v-divider></v-divider>
            <v-btn @click="dialog=true">사진 바꾸기</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-card-title primary-title>
              <div>
                <div class="headline font-weight-bold">{{user.name}}({{user.id}})</div>
                <div class="title">
                  class:
                  <span>{{lvDic[user.lv]}}</span>
                </div>
                <div>
                  생성일:
                  <span>{{user.regDate}}</span>
                </div>
                <div>
                  출석:
                  <span>{{user.inCnt}}</span>
                </div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-dialog v-model="dialog" width="700" dark>
      <v-card color="blue lighten-2">
        <v-card-title class="headline">변경할 이미지를 고르세요</v-card-title>

        <v-card-text>
          <v-container grid-list-xl>
            <v-layout wrap>
              <v-flex v-for="(item,idx) in profiles" :key="idx">
                <v-avatar
                  :tile="false"
                  size="130"
                  color="grey lighten-4"
                  @click="clickSample(item)"
                >
                  <img :src="item" alt="avatar">
                </v-avatar>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1 font-weight-bold" @click="rtnProfile">닫기</v-btn>
          <v-btn color="greed darken-1 font-weight-bold" @click="submitProfile">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props: ["user"],
  computed: {
    isSelectProfile() {
      return this.user.img === this.img;
    }
  },
  data() {
    return {
      lvDic: ["관리자", "작가", "독자", "손님"],
      profiles: [
        "https://randomuser.me/api/portraits/lego/1.jpg",
        "https://randomuser.me/api/portraits/lego/6.jpg",
        "https://randomuser.me/api/portraits/lego/8.jpg",
        "https://randomuser.me/api/portraits/lego/9.jpg"
      ],
      dialog: false,
      img: ""
    };
  },
  methods: {
    clickSample(selectImg) {
      this.img = this.user.img;
      this.user.img = selectImg;
    },
    rtnProfile() {
      //만약 다른이미지를 누른채 취소를 누르면 원래대로 돌림
      if (this.img) this.user.img = this.img;
      this.img = "";
      this.dialog = false;
    },
    submitProfile() {
      this.$axios
        .put(`user/`, { img: this.user.img })
        .then(() => {
          this.$store.commit("setProfile", this.user.img);
          this.$store.commit("pop", {
            msg: "이미지 수정 완료",
            color: "success"
          });
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        })
        .finally(() => {
          this.img = "";
          this.dialog = false;
        });
    }
  }
};
</script>

