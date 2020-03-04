const express = require('express');

const PostController = require('../controllers/posts');

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();


router.post("",checkAuth,extractFile,PostController.createPosts);

router.put("/:id",checkAuth,extractFile,PostController.updatePost);

router.get("/:id",PostController.getPost);

router.get('',PostController.getPots);

router.delete('/:id',checkAuth,PostController.deletePosts);


module.exports = router ;
