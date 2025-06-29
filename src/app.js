const express = require("express");

const app = express();

// app.get("/hello", (req, res) => {
//   res.send("Hello from get");
// });
// app.post("/hello", (req, res) => {
//   res.send("Hello from post");
// });
// app.delete("/hello", (req, res) => {
//   res.send("Hello deleted ");
// });

// app.use("/hello", (req, res) => {
//   res.send("Hello from hello");
// });
// app.use("/", (req, res) => {
//   res.send("Hello from server");
// });

app.get("/user/:userId", (req, res) => {
  console.log(req.params);
  res.send({ firstname: "avinash", lastname: "pilli" });
});

app.listen(3000, () => {
  console.log("server is successfully listening to port 3000");
});
