const express= require("express");
const app = express();
const generator = require("./generator");

app.get("/", (req,res)=>{
    res.send({msg:"it worked."})
});

app.use("/create", generator)

app.listen(3000);