<template>
  <v-layout row justify-center>
    <v-btn color="cyan" dark fixed bottom right fab large @click="dialog = true">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{boardId}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Legal first name*" required v-model="form.title"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Legal middle name"
                  hint="example of helper text only on focus"
                  required
                  v-model="form.content"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*제목과 내용을 반드시 입력하세요</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="addArticle()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  props: ["boardId"],
  data() {
    return {
      dialog: false,
      form: {
        title: "",
        content: ""
      }
    };
  },
  methods: {
    addArticle() {
      this.form.title = this.form.title.trim();
      this.form.content = this.form.content.trim();
      if (!(this.form.title && this.form.content))
        return this.$store.commit("pop", {
          msg: "제목과 내용을 모두 입력해주세요",
          color: "primary"
        });
      this.$axios
        .post(`${this.$apiRootPath}/article/${this.boardId}`, this.form)
        .then(() => {
          this.dialog = false;
          this.form = { title: "", content: "" };
          this.$emit("list");
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    }
  }
};
</script>

<style>
</style>
