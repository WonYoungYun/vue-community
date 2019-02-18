<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>회원 가입</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-validate="'required|min:3|max:20'"
                v-model="form.id"
                :counter="20"
                :error-messages="errors.collect('id')"
                label="아이디"
                data-vv-name="id"
                required
              ></v-text-field>
              <v-text-field
                v-validate="'required|min:4|max:40'"
                v-model="form.pwd"
                :counter="40"
                :error-messages="errors.collect('pwd')"
                label="비밀번호"
                data-vv-name="pwd"
                required
                type="password"
              ></v-text-field>
              <v-text-field
                v-validate="'required|min:1|max:40'"
                v-model="form.name"
                :counter="40"
                :error-messages="errors.collect('name')"
                label="이름"
                data-vv-name="name"
                required
              ></v-text-field>
              <v-checkbox
                v-validate="'required'"
                v-model="agree"
                :error-messages="errors.collect('checkbox')"
                value="1"
                label="약관동의: 실제 사용중인 아이디로 절대 가입하지 마시기 바랍니다"
                data-vv-name="checkbox"
                required
              ></v-checkbox>
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
            <v-btn @click="checkRobot()" color="success">가입</v-btn>
            <v-btn @click="clear" color="warning">취소</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ko from "vee-validate/dist/locale/ko";
export default {
  $_veeValidate: {
    validator: "new"
  },

  data: () => ({
    form: {
      id: "",
      pwd: "",
      name: "",
      response: ""
    },
    sb: {
      act: false,
      msg: "",
      color: "warning"
    },
    invisible: false,
    agree: null,
    dictionary: {
      messages: ko.messages,
      attributes: {
        id: "아이디",
        pwd: "패스워드",
        name: "이름",
        agree: "이용약관"
        // custom attributes
      },
      custom: {}
    },
    isRecaptchaAlert: false
    // invisible: ""
  }),

  mounted() {
    this.$validator.localize("ko", this.dictionary);
  },

  methods: {
    onVerify(r) {
      this.form.response = r;
    },
    onExpired() {
      this.form.response = "";
    },
    checkRobot() {
      if (this.form.response) this.submit();
      else this.isRecaptchaAlert = true;
    },
    submit() {
      this.$validator
        .validateAll()
        .then(r => {
          if (!r)
            return this.$store.commit("pop", {
              msg: "모두 작성해주세요",
              color: "warning"
            });
          return this.$axios.post("/sign/up", this.form);
        })
        .then(r => {
          if (!r.data.success) throw this.pop("서버에러", "warning");
          this.$refs.recaptcha.reset();
          this.$store.commit("pop", {
            msg: "가입 완료 되었습니다",
            color: "success"
          });
          this.$router.push("/sign");
        })
        .catch(e => {
          if (!e.response)
            this.$store.commit("pop", { msg: e.message, color: "warning" });
        });
    },
    clear() {
      this.form.id = "";
      this.form.pwd = "";
      this.form.name = null;
      this.agree = null;
      this.$validator.reset();
    }
  }
};
</script>