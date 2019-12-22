const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS");
    next();

});

app.post("/api/posts",(req,res,next)=>{
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post Added Succesfully'
  });

});

app.get('/api/posts',(req,res,next)=> {
  const posts = [
    { id:'asdsadasd456',
    title:"first",
    content: "asdgsahgdasjdgasd"
  },
    { id:'asdsadas48782',
    title:"second",
    content: "aswd"
  }
  ];
  res.status(200).json({
    message: 'Post fetched Susccesfully',
    posts: posts
  });

});

module.exports = app;
