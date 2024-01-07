const indexDao = require("../DataAccessObject/indexDao");

//todo 생성
exports.createdTodo = async function (req, res) {
  const { userIdx } = req.verifiedToken;
  const { contents, type } = req.body;

  if (!userIdx || !contents || !type) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "입력값이 누락 되었습니다.",
    });
  }

  //contents 20 글자 초과 불가
  if (contents.length > 20) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "contents must be less than 20 characters",
    });
  }

  //type: do , decide, delete, delegate
  const validTypes = ["do", "decide", "delete", "delegate"];
  if (!validTypes.includes(type)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "invalid type",
    });
  }

  const insertTodoRow = await indexDao.insertTodo(userIdx, contents, type);

  if (!insertTodoRow) {
    return res.send({
      isSuccess: false,
      code: 403,
      message: "failed request. contact administrator",
    });
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: "일정 생성 성공",
  });
};

//todo 조회

exports.readTodo = async function (req, res) {
  const { userIdx } = req.verifiedToken;

  const todos = {};
  const types = ["do", "decide", "delegate", "delete"];

  for (let type of types) {
    let selectTodoByTypeRows = await indexDao.selectTodoByType(userIdx, type);

    if (!selectTodoByTypeRows) {
      return res.send({
        isSuccess: false,
        code: 400,
        message: "failed to load 일정관리, contact administrator",
      });
    }

    todos[type] = selectTodoByTypeRows;
  }

  return res.send({
    result: todos,
    isSuccess: true,
    code: 200,
    message: "일정 조회 성공",
  });
};

//todo update
exports.updateTodo = async function (req, res) {
  const { userIdx } = req.verifiedToken;
  let { todoIdx, contents, status } = req.body;

  if (!userIdx || !todoIdx) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "userIdx 와 todoIdx 를 보내주세요",
    });
  }

  if (!contents) {
    contents = null;
  }

  if (!status) {
    status = null;
  }

  const isValidTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);

  //비어있는 List 일 경우
  if (isValidTodoRow.length < 1) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "유효한 요청이 아닙니다. userIdx 와 todoIdx 를 확인하세요",
    });
  }

  const updateTodoRow = await indexDao.updateTodo(
    userIdx,
    todoIdx,
    contents,
    status
  );

  if (!updateTodoRow) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "수정 실패. 관리자에게 문의해 주세요",
    });
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: "수정 성공",
  });
};

//todo 삭제
exports.deleteTodo = async function (req, res) {
  const { userIdx } = req.verifiedToken;
  const { todoIdx } = req.params;

  if (!userIdx || !todoIdx) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "userIdx 혹은 todoIdx 가 조회 되지 않았습니다.",
    });
  }

  const isValidTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);

  //비어있는 List 일 경우
  if (isValidTodoRow.length < 1) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "유효한 요청이 아닙니다. userIdx 와 todoIdx 를 확인하세요",
    });
  }

  const deleteTodoRow = await indexDao.deleteTodo(userIdx, todoIdx);

  if (!deleteTodoRow) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "삭제 실패. 관리자에게 문의해 주세요",
    });
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: "삭제 성공",
  });
};
