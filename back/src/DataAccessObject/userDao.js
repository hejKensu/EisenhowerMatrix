const { pool } = require("../../database");

exports.insertUser = async function (email, password, nickname) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const insertUserQuery =
        "INSERT INTO Users (email, password, nickname) values (?, ?, ?);";
      const insertUserParams = [email, password, nickname];

      const [row] = await connection.query(insertUserQuery, insertUserParams);
      return row;
    } catch (err) {
      console.error(` ##### insertUserRows Query error #####`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(` #### insertUserRows DB Error ####`);
    return false;
  }
};

//중복 회원 여부 검사
exports.selectUserByEmail = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const selectUserByEmailQuery = "SELECT * from Users where email = ?;";
      const selectUserByEmailParams = [email];

      const [row] = await connection.query(
        selectUserByEmailQuery,
        selectUserByEmailParams
      );
      return row;
    } catch (err) {
      console.error(` ##### selectUserByEmailRows Query error #####`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(` #### selectUserByEmailRows DB Error ####`);
    return false;
  }
};

//로그인시 계정 존재 여부 확인
exports.selectAccount = async function (email, password) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const selectAccountQuery =
        "SELECT * from myTodoDB.Users where email = ? and password = ?;";
      const selectAccountParams = [email, password];

      const [row] = await connection.query(
        selectAccountQuery,
        selectAccountParams
      );
      return row;
    } catch (err) {
      console.error(` ##### selectAccountRows Query error #####`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(` #### selectAccountRows DB Error ####`);
    return false;
  }
};

// jwt token 존재 여부 시 로그인 후 Nickname 으로 Header 부분 표시
exports.selectNicknameByUserIdx = async function (userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const selectNicknameByUserIdxQuery =
        "select * from Users where userIdx = ?";
      const selectNicknameByUserIdxParams = [userIdx];

      const [row] = await connection.query(
        selectNicknameByUserIdxQuery,
        selectNicknameByUserIdxParams
      );
      return row;
    } catch (err) {
      console.error(` ##### selectNicknameByUserIdxRows Query error #####`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(` #### selectNicknameByUserIdxRows DB Error ####`);
    return false;
  }
};
