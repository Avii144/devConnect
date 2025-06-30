const express = require("express");

const app = express();
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("error");
  }
});
app.get("/getuserData", (req, res) => {
  try {
    throw new Error("afdasd");
  } catch (err) {
    res.status(500).send("Somehing is error");
  }
});

app.listen(3000, () => {
  console.log("server is successfully listening to port 3000");
});
