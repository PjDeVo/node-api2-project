const app = require("./server.js");

const port = 4000;

app.listen(port, () => {
  console.log(`server listening on custom port ${port}`);
});
