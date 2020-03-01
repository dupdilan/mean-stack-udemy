const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'

};

const storage = multer.diskStorage({
  destination: (res,file,cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type!");
    if(isValid){
      error = null;
    }
    cb(null, "backend/images");
  },
  filename:(req, file,cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '_'+ Date.now()+'.'+ ext);
  }
});

router.post("",checkAuth,multer({storage: storage}).single("image"),(req,res,next)=>{
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" +req.file.filename,
    creator: req.userData.userId
  });
  // console.log(req.userData);
  // return res.status(200).json({});
  // console.log(post);
  post.save().then(createdPost => {
    // console.log(result);
    res.status(201).json({
      message: 'Post Added Succesfully',
      post : {
        ...createdPost,
        id:createdPost._id
        // id: createdPost.id,
        // title:createdPost.title,
        // content:createdPost.content,
        // imagePath: createdPost.imagePath
      }
  });


  }).catch(error => {
    res.status(500).json({
      message: "creating a post failed!"
    });
  });

});

router.put("/:id",checkAuth,multer({storage: storage}).single("image"),(req,res,next)=>{
  // console.log(req.file);
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post =new Post({
    _id: req.body.id,
    title: req.body.title,
    content:req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  // console.log(post);
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post )
  .then(result => {
    // console.log(result);
    if(result.nModified > 0){
      res.status(200).json({ message: "Updated Successful!"});
    } else{
      res.status(401).json({ message: "Not authorized!"});
    }

  }).catch(error =>{
    res.status(500).json({
      message: "couldn't update post!"
    });
  });
});

router.get("/:id",(req,res,next)=>{
  Post.findById(req.params.id)
  .then(post => {
    if(post){
      res.status(200).json(post);
    } else {
      res.status(404).json({message : 'Post not Found!'});
    }
  }).catch(error =>{
    res.status(500).json({
      message: "Fetching post failed!"
    });
  })
});

router.get('',(req,res,next)=> {
  const pagesize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPost;
  if(pagesize && currentPage){
    postQuery.skip(pagesize * (currentPage - 1))
    .limit(pagesize);
  }
  // const posts = [
  //   { id:'asdsadasd456',
  //   title:"first",
  //   content: "asdgsahgdasjdgasd"
  // },
  //   { id:'asdsadas48782',
  //   title:"second",
  //   content: "aswd"
  // }
  // ];

  postQuery.then(documents =>{
    // console.log(document);
    fetchedPost = documents;
     return Post.count();
  })
  .then(count => {
      res.status(200).json({
      message: 'Post fetched Susccesfully',
      posts: fetchedPost,
      maxPost: count
    });
  }).catch(error =>{
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });

});

router.delete('/:id',checkAuth,(req,res,next)=>{
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id,creator: req.userData.userId})
  .then(result => {
    // console.log(result);
    if(result.n > 0){
      res.status(200).json({message: 'Post deleted'});
    } else{
      res.status(401).json({ message: "Not authorized!"});
    }

  }).catch(error =>{
    res.status(500).json({
      message: "deleting post failed!"
    });
  })

});


module.exports = router ;
