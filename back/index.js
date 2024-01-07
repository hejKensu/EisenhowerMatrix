const express = require("express");
const compression = require("compression");
const cors = require("cors");
const { indexRouter } = require("./src/router/indexRouter");
const { userRouter } = require("././src/router/userRouter");

const app = express();
const port = 3000;

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

/* express 미들웨어 설정 */

//cors 설정
app.use(cors()); //보완설정을 느슨하게 설정

//body json 파싱
app.use(express.json()); //클라이언트 에서 나온 Data Packet 의 Body Part를 추축

//HTTP 요청 압축
app.use(compression()); //HTTP 압축 (효율적이다)

// app.post("/user", function (req, res) {
//     const name = req.body.name
//     return res.send(name);
// });

//Router Separation
indexRouter(app);
userRouter(app);

app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`);
});
