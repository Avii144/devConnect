const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Hello from server");
});
app.listen(3000, () => {
  console.log("server is successfully listening to port 3000");
});
