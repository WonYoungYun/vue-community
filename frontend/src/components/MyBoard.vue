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
            <v-btn color="primary" flat @click="$router.push(`/board/${board.name}`)">바로가기</v-btn>
          </v-container>
          <v-divider></v-divider>
          <v-container>
            <div>생성일: {{board.regDate}}</div>
          </v-container>
        </div>
      </v-flex>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>//$emit을 통해 올리기
      <v-btn color="success">수정</v-btn>
      <v-btn color="error">삭제</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["board"]
};
</script>

<style>
</style>
