const express= require("express");
const app = express();
const generator = require("./generator");

app.use("/", generator)

app.listen(3000);