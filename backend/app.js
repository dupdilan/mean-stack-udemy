const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

// mongoose.connect('mongodb+srv://max:!@#123456789123ghj@cluster0-oxowv.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true , useUnifiedTopology: true  });

mongoose.connect('mongodb://localhost:27017/node-angular', {useNewUrlParser: true , useUnifiedTopology: true})
.then(()=> {
  console.log('DB connected!');
})
.catch(()=>{
  console.log('DB connection Faild!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS");
    next();

});

app.post("/api/posts",(req,res,next)=>{
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // console.log(post);
  post.save().then(createdPost => {
    // console.log(result);
    res.status(201).json({
      message: 'Post Added Succesfully',
      postId: createdPost._id
  });


  });

});

app.put("/api/posts/:id",(req,res,next)=>{
  const post =new Post({
    _id: req.body.id,
    title: req.body.title,
    content:req.body.content
  });
  Post.updateOne({_id: req.params.id}, post ).then(result => {
    console.log(result);
    res.status(200).json({ message: "Updated Successful!"});
  });
});

app.get('/api/posts',(req,res,next)=> {
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
  Post.find()
  .then(documents =>{
    // console.log(document);
      res.status(200).json({
      message: 'Post fetched Susccesfully',
      posts: documents
    });
  });

});

app.delete('/api/posts/:id',(req,res,next)=>{
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    // console.log(result);
    res.status(200).json({message: 'Post deleted'});
  })

});

module.exports = app;
