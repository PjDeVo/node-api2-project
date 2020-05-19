const express = require("express");
const posts = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  posts.find().then((posts) => {
    res.status(200).json(posts);
  });
});

router.post("/", (req, res) => {
  posts
    .insert(req.body)
    .then(() => {
      const post = req.body;
      if (!post.title || !post.contents) {
        res.status(400).json({
          errorMessage: " Please Provide Title and Contents For The Post",
        });
      } else {
        res.status(201).json(post);
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "There was an error while saving to the database" });
    });
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  posts.findPostComments(id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else
      [
        res.status(404).json({
          errorMessage: "The Post with the Specified ID does Not Exist",
        }),
      ].catch((error) => {
        res
          .status(500)
          .json({ error: "The comments information can not be retrieved" });
      });
  });
});

router.post("/:id/comments", (req, res) => {
  const post = req.body;
  const id = req.params.id;
  req.body.post_id = id;
  const found = posts.findPostComments(id);

  if (found.length === 0) {
    res
      .status(404)
      .json({ errorMessage: "The Post With The Specified ID Does Not Exist" });
  }
  if (!post.text) {
    res
      .status(400)
      .json({ errorMessage: "Please Provide Text For the Comment" });
  } else {
    posts
      .insertComment(post)
      .then((id) => {
        res.status(201).json(id);
      })
      .catch((error) => {
        res.status(500).json({
          errorMessage:
            " There Was An Error While Saving the Comment To The Database",
        });
      });
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  posts
    .remove(id)
    .then((post) => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({
          errorMessage: "the post with the specified ID Does Not Exist",
        });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ errorMessage: "There was an error linking to the DB" });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  if (!updates.title || updates.contents) {
    res
      .status(404)
      .json({ errorMessage: "Please Provide Title and Contents for the post" });
  } else {
    posts
      .update(id, updates)
      .then((changes) => {
        if (changes) {
          res.status(200).json({ changes });
        } else {
          res
            .status(404)
            .json({ errorMessage: "The Post With that ID Does Not Exist" });
        }
      })
      .catch((error) => {
        res
          .status(500)
          .json({ errorMessage: "can Not connect to the Database" });
      });
  }
});
module.exports = router;
