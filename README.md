MEVV
=
Mongodb-Express-Vue-Vuetify 개발을 위한  보일러플레이트

구성
=

Front-end
-
 - vue cli 3.0
 - vuex
 - vuetify
 - vue-router
 - axios
  
Back-end
-
   - cors
   - http-errors
   - mongoose
   - morgan


설치방법
=
 ```
 cd backend
 npm install
 ```
 ```
 cd frontend
 npm install
 ```

```
yarn dev //express 실행
yarn serve //vue 실행
```

외부 package.json을 통해 backend 파일이나 frontend 파일을 들어가지 않고도 실행이 가능합니다.

config.js
-
mongodb와 express를 연결 하기 위해 `backend/config/index.js`  파일을 생성해야 합니다.
```
const config = {

    dbUrl: 'mongodb URL',
    admin: {
        id: '관리자 아이디',
        pwd: '관리자 패스워드', 
        name: '관리자 닉네임' 
    },


}

module.exports = config

```




 버튼을 눌렀을 때 라우터 변경시 Throws error "Uncaught TypeError: Cannot set property 'touched' of undefined" 오류가 뜨는 문제가 있었다
 이것을 해결하기 위해 뷰티파이 깃허브를 보았고 
 https://github.com/vuetifyjs/vuetify/commit/0cd56717b0b4334c78e8e99dc7bad6b7dc479d0b
 여기서 이슈 해결에 대한 대답을 확인함
