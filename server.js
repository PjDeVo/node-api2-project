const express = require("express");
const server = express();
const postsRouter = require("./data/routers/posts-router.js");

server.use(express.json());
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2> Hey there </h2>
    `);
});

module.exports = server;
