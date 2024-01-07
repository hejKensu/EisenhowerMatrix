const userDao = require("../DataAccessObject/userDao");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../secret");

exports.signup = async function (req, res) {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "회원가입 입력 값을 부탁 드립니다.",
    });
  }

  //이메일 정규표현식 확인
  const isValidEmail =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  if (!isValidEmail.test(email)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "이메일 형식을 확인해 주세요.",
    });
  }

  //비밀번호 정규표현식 확인
  const isValidPassword = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/; // 8 ~ 20 자 영문, 숫자 조합

  if (!isValidPassword.test(password)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "비밀번호 형식을 확인해 주세요. 8 ~ 20 자 영문, 숫자 조합",
    });
  }

  //닉네임 정규표현식 확인
  if (nickname.length < 2 || nickname.length > 20) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "닉네임 형식 확인해 주세요. 2 ~ 20 글자 ",
    });
  }

  //중복 회원 검사 (이메일을 Query 를 통해서 조회해서 검색이 되면 length 가 0 보다 크고 고로 중복 가입을 막는다.)
  const isDuplicatedEmail = await userDao.selectUserByEmail(email);
  if (isDuplicatedEmail.length > 0) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "이미 가입 처리 된 회원 입니다.",
    });
  }

  //DB 입력
  const insertUserRow = await userDao.insertUser(email, password, nickname);

  if (!insertUserRow) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "회원가입 실패. 관리자 에게 문의하세요.",
    });
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: "회원가입 성공!",
  });
};

exports.signin = async function (req, res) {
  const { email, password } = req.body;

  if (!email | !password) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "회원 정보를 입력 하십시오.",
    });
  }

  //회원 여부 검사
  const isValidAccount = await userDao.selectAccount(email, password);
  if (!isValidAccount) {
    return res.send({
      isSuccess: false,
      code: 410,
      message: "DB 에러, 담당자에게 문의해 주세요",
    });
  }

  if (isValidAccount.length < 1) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "존재 하지 않는 회원 입니다.",
    });
  }

  //jwt Token 발급
  const [accountInfo] = isValidAccount;
  const userIdx = accountInfo.userIdx;
  const token = jwt.sign(
    { userIdx: userIdx }, //Payload
    jwtSecret //Secret Ket
  );

  return res.send({
    result: { token: token },
    isSuccess: true,
    code: 200,
    message: "로그인 성공!",
  });
};

//jwt 검증 API
exports.getNicknameByToken = async function (req, res) {
  const { userIdx } = req.verifiedToken;

  const [userInfo] = await userDao.selectNicknameByUserIdx(userIdx);
  const nickname = userInfo.nickname;

  return res.send({
    result: { nickname: nickname },
    isSuccess: true,
    code: 200,
    message: "토큰 검증 성공",
  });
};
