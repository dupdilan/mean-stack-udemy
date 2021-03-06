const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

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

app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS");
    next();

});

app.use("/api/posts", postRoutes)
app.use("/api/user", userRoutes)

module.exports = app;
