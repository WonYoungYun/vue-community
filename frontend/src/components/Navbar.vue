<template>
  <v-list two-line>
    <v-list-tile v-for="item in items" :key="item.title" :to="item.to">
      <v-list-tile-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider></v-divider>
    <v-list v-if="userLvCheck">
      <v-list-tile v-for="item in users" :key="item.title" :to="item.to">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </v-list>
    <v-list v-if="writerLvCheck">
      <v-list-tile v-for="item in writers" :key="item.title" :to="item.to">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list-group v-if="manageLvCheck" :prepend-icon="manages.icon" no-action>
      <v-list-tile slot="activator">
        <v-list-tile-content>
          <v-list-tile-title>{{ manages.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-for="subItem in manages.subItems" :key="subItem.title" :to="subItem.to">
        <v-list-tile-content>
          <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list-group>
  </v-list>
</template>
<script>
export default {
  mounted() {
    if (localStorage.getItem("token")) {
      this.$axios
        .get(`user`)
        .then(r => {
          if (!r.data.success) throw new Error(r.data.msg);
          this.$store.commit("getToken", r.data.userData);
          console.log("데이터 받아왔어요");
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    }
  },
  computed: {
    userLvCheck() {
      return this.$store.state.user.lv < 3;
    },
    writerLvCheck() {
      return this.$store.state.user.lv < 2;
    },
    manageLvCheck() {
      return this.$store.state.user.lv === 0;
    }
  },
  data() {
    return {
      items: [
        {
          icon: "home",
          title: "메인 화면",
          to: {
            path: "/"
          }
        },
        {
          icon: "notification_important",
          title: "공지사항",
          to: {
            path: "/about"
          }
        }
      ],
      users: [
        {
          icon: "notification_important",
          title: "내가 남긴 댓글",
          to: {
            path: "/mycomments"
          }
        },
        {
          icon: "notification_important",
          title: "마이페이지",
          to: {
            path: "/myconfig"
          }
        }
      ],
      writers: [
        {
          icon: "notification_important",
          title: "내 게시판 바로가기",
          to: {
            path: `/board/${this.$store.state.user._id}`
          }
        }
      ],
      manages: {
        icon: "settings",
        title: "관리자 메뉴",
        subItems: [
          {
            icon: "face",
            title: "users",
            to: {
              path: "/manage/users"
            }
          }
        ]
      }
    };
  }
};
</script>