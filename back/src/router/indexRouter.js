const indexController = require("../controller/indexController");
const { jwtMiddleware } = require("../../jwtMiddleware");

exports.indexRouter = function (app) {
  // 일정 CRUD API
  app.post("/todo", jwtMiddleware, indexController.createdTodo); // create
  app.get("/todos", jwtMiddleware, indexController.readTodo); // read
  app.patch("/todo", jwtMiddleware, indexController.updateTodo); //update
  app.delete("/todo/:todoIdx", jwtMiddleware, indexController.deleteTodo); //delete, user/1 번의  todo/2번을 지운다 example

  app.get(
    "/dummy",
    function (req, res, next) {
      console.log(1);
      next();
    },
    function (req, res, next) {
      console.log(2);
      //next();
    },
    function (req, res, next) {
      console.log(3);
      return;
    }
  );
};
