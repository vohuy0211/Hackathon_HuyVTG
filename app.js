const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const userRouter = require("./Router/user.router");
const portRouter = require("./Router/port.router");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/port", portRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
