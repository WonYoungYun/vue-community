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
      <v-list-tile :to="writer.to">
        <v-list-tile-action>
          <v-icon>{{ writer.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ writer.title }}</v-list-tile-title>
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
  props: ["userId"],
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
          icon: "notifications",
          title: "공지사항",
          to: {
            path: "/board/공지사항"
          }
        }
      ],
      users: [
        {
          icon: "person",
          title: "마이페이지",
          to: "/myconfig"
        }
      ],
      writer: {
        icon: "folder",
        title: "내 게시판",
        to: "/myboard/"
      },

      manages: {
        icon: "settings",
        title: "관리자 메뉴",
        subItems: [
          {
            icon: "face",
            title: "유저 현황",
            to: {
              path: "/manage/users"
            }
          },
          {
            icon: "folder",
            title: "게시판 현황",
            to: {
              path: "/manage/boards"
            }
          }
        ]
      }
    };
  },
  methods: {}
};
</script>