const userController = require("../controller/userController");
const { jwtMiddleware } = require("../../jwtMiddleware");

exports.userRouter = function (app) {
  //회원가입 API
  app.post("/user", userController.signup);

  //로그인 API
  app.post("/sign-in", userController.signin);
  //jwt 를 생성하는 API (결국에 로그인은 jwt[token] 을 생성하는 것이다.)

  //jwt 검증 API
  app.get("/jwt", jwtMiddleware , userController.getNicknameByToken);
};
