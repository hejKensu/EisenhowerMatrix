const { pool } = require("../../database");

exports.getUserRows = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const selectUserQuery = "SELECT * FROM myTodoDB.Users;";
      const [row] = await connection.query(selectUserQuery);
      return row;
    } catch (err) {
      console.error(` ##### getUserRows Query error #####`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(` #### getUserRows DB Error ####`);
    return false;
  }
};

exports.insertTodo = async function (userIdx, contents, type) {
  try {
    //DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      //쿼리
      const insertTodoQuery =
        "INSERT INTO Todos (userIdx, contents, type) values (?, ?, ?)";
      const insertTodoParams = [userIdx, contents, type];

      const selectUserQuery = "SELECT * FROM myTodoDB.Users;";
      const [row] = await connection.query(insertTodoQuery, insertTodoParams);
      connection.release();
      return row;
    } catch (err) {
      console.error(` ##### insertTodoQuery Query error ##### \n ${err}`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.error(` #### insertTodoQuery DB Error #### \n ${err}`);
    return false;
  }
};

exports.selectTodoByType = async function (userIdx, type) {
  try {
    //DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      //쿼리
      const selectTodoByTypeQuery =
        "SELECT todoIdx, contents, status  FROM Todos where userIdx = ? and type = ? and not(status = 'D');";
      const selectTodoByTypeParams = [userIdx, type];

      const [row] = await connection.query(
        selectTodoByTypeQuery,
        selectTodoByTypeParams
      );
      connection.release();
      return row;
    } catch (err) {
      console.error(` ##### selectTodoByType Query error ##### \n ${err}`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.error(` #### selectTodoByType DB Error #### \n ${err}`);
    return false;
  }
};

exports.selectValidTodo = async function (userIdx, todoIdx) {
  try {
    //DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      //쿼리
      const selectValidTodoQuery =
        "SELECT * FROM Todos where userIdx = ? and todoIdx = ? and not(status = 'D');";
      const selectValidTodoParams = [userIdx, todoIdx];

      const [row] = await connection.query(
        selectValidTodoQuery,
        selectValidTodoParams
      );
      connection.release();
      return row;
    } catch (err) {
      console.error(` ##### selectValidTodo Query error ##### \n ${err}`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.error(` #### selectValidTodo DB Error #### \n ${err}`);
    return false;
  }
};

exports.updateTodo = async function (userIdx, todoIdx, contents, status) {
  try {
    //DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      //쿼리
      const updateTodoQuery =
        "UPDATE Todos set contents = IFNULL(?,contents)  , status = IFNULL(?,status)  where userIdx = ? and todoIdx = ?";
      const updateTodoParams = [contents, status, userIdx, todoIdx];

      const [row] = await connection.query(updateTodoQuery, updateTodoParams);
      connection.release();
      return row;
    } catch (err) {
      console.error(` ##### updateTodo Query error ##### \n ${err}`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.error(` #### updateTodo DB Error #### \n ${err}`);
    return false;
  }
};

exports.deleteTodo = async function (userIdx, todoIdx) {
  try {
    //DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      //쿼리
      const deleteTodoQuery =
      "UPDATE Todos set status = 'D' where userIdx = ? and todoIdx = ?;";
      const deleteTodoParams = [userIdx, todoIdx];

      const [row] = await connection.query(deleteTodoQuery, deleteTodoParams);
      connection.release();
      return row;
    } catch (err) {
      console.error(` ##### deleteTodo Query error ##### \n ${err}`);
      connection.release();
      return false;
    }
  } catch (err) {
    console.error(` #### deleteTodo DB Error #### \n ${err}`);
    return false;
  }
};
