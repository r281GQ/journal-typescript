const express = require("express");

const app = express();

app.get("*", (_req, res) => {
  res.send("hey");
});

app.listen(6000, () => {
  console.log("app running");
});
