MEV-community
=
Mongo - Express - Vue.js를 이용하여 만든 커뮤니티 사이트


설치방법
=
config.js설정 (필수!)
-
mongodb와 express를 연결 및 구글 리캡챠를 사용하기 위해 `backend/config/index.js`와  `fontend/src/config/index.js`  파일을 생성해야 합니다.

backend/config/index.js
-
```
const config = {

    dbUrl: 'mongodb URL',
    admin: {
        id: '관리자 아이디',
        pwd: '관리자 패스워드', 
        name: '관리자 닉네임' 
    },
    recaptchaSecret: '//구글 리캡챠 비밀키' 

}

module.exports = config
```
fontend/src/config/index.js
-
```
export const key = {
    recaptchaSiteKey: '//구글 리캡챠 사이트 키'
}

```

실행하기
-
백엔드준비
```
cd backend
yarn
```
프론트엔드 준비
```
cd frontend
yarn
```

외부 package.json을 통해 backend 파일이나 frontend 파일을 들어가지 않고도 실행이 가능합니다.
```
cd..
yarn dev //express 실행
yarn serve //vue 실행
```

기능
=

- 유저
    - 회원가입
    - 로그인/로그아웃(기억하기 체크시 7일유지, 하지 않으면 1시간 로그인 상태를 유지)
    - 권한
      - 0(관리자) : 유저 삭제 및 게시판 삭제를 할 수있는 관리 탭 사용, 유저 권한 변경, 게시글 삭제, 댓글 삭제
      - 1(작가) : 게시판 생성, 수정, 삭제
      - 2(독자) : 댓글 작성, 수정, 삭제, 마이페이지(내가 쓴 글의 수, 댓글의 수, 비밀번호 변경, 닉네임 변경, 이미지 변경, 회원 탈퇴)
      - 3(손님) : 게시판, 댓글 보기, 

- 게시판 
    - 게시글을 작성할 수 있다.
    - 게시판의 게시글 수, 게시판 뷰 수 확인
    - 게시판의 수정은 게시판을 작성한 사람만 가능

- 게시글
    - 댓글을 작성할 수 있다.
    - 게시글은 게시판의 해당 게시판의 주인(작가) 만 작성이 가능하다.
    - 게시글의 뷰 수, 댓글의 수 확인가능
    - 게시글의 수정은 게시글을 작성한 사람만 가능

- 댓글
    - 댓글의 세부내용을 확인할 수 있다.
    - 댓글의 수정은 댓글을 작성한 사람만 가능





뷰티파이 에러 관련 
-

버튼을 눌렀을 때 라우터 변경시 Throws error "Uncaught TypeError: Cannot set property 'touched' of undefined" 오류가 뜨는 문제가 있었다.

이것을 해결하기 위해 구글링 결과 뷰티파이 깃허브의 https://github.com/vuetifyjs/vuetify/commit/0cd56717b0b4334c78e8e99dc7bad6b7dc479d0b
이 글에서 해당 이슈 해결에 대한 해결법을 확인




