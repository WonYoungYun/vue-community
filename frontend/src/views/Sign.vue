<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field prepend-icon="person" v-model="form.id" label="아이디" type="text"></v-text-field>
              <v-text-field
                prepend-icon="lock"
                v-model="form.pwd"
                label="비밀번호"
                type="password"
                @keyup.enter="signIn"
              ></v-text-field>
              <v-checkbox v-model="form.remember" label="암호 기억하기(최대 7일간 보관됩니다.)"></v-checkbox>
            </v-form>
            <vue-recaptcha
              ref="recaptcha"
              :sitekey="$cfg.recaptchaSiteKey"
              @verify="onVerify"
              @expired="onExpired"
            ></vue-recaptcha>
            <v-alert :value="isRecaptchaAlert" type="error">Please Check Recaptcha</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="checkRobot">로그인</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        id: "",
        pwd: "",
        remember: false
      },
      isRecaptchaAlert: false
    };
  },
  methods: {
    onVerify(r) {
      this.form.response = r;
    },
    onExpired() {
      this.form.response = "";
    },
    checkRobot() {
      if (this.form.response) this.signIn();
      else this.isRecaptchaAlert = true;
    },
    signIn() {
      this.$axios
        .post(`${this.$apiRootPath}sign/in`, this.form)
        .then(r => {
          if (!r.data.success)
            return this.$store.commit("pop", {
              msg: r.data.msg,
              color: "warning"
            });
          localStorage.setItem("token", r.data.token);
          this.$store.commit("getToken", r.data.userData);
          this.$store.commit("pop", {
            msg: `${this.$store.state.user.id}님 환영합니다!`,
            color: "primary"
          });
          this.isRecaptchaAlert = false;
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