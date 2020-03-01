const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user");
const router = express.Router();

router.post("/signup",(req,res,next) =>{

  bcrypt.hash(req.body.password, 10)
  .then(hash => {
      const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message: "user created",
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
          message: "Invalid authentication credentials!"
      });
    });

  });
});


router.post("/login", (req,res,next) =>{
  let fetchedUser;
  User.findOne({email: req.body.email})
  .then(user => {
    // console.log(user);
    if(!user){
      return res.status(401).json({
        message: "Auth Falied"
      });
    }
    fetchedUser = user;
    // console.log(fetchedUser);
    return bcrypt.compare(req.body.password, user.password);
  })
  .then( result => {
    // console.log(result);
    if(!result){
      return res.status(401).json({
        message: "Auth Falied"
      });
    }

    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id},
       'secret_this_should_be_longer_dupdilan',
       { expiresIn: '1h'}
       );
        // console.log(token);
       res.status(200).json({
         token: token,
         expiresIn: 3600,
         userId: fetchedUser._id
       });
  })
  .catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "Invalid Authentication Creadintials!"
    });
  });
});

module.exports = router;
