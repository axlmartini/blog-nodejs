const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = (req, res, next)=> {
  User.find()
  .select('_id email')
  .exec()
  .then( users => {
    const response = {
      count: users.length,
      users: users.map(user => {
        return {
          _id : user._id,
          email: user.email,
          name: user.name,
          request: {
            type: "GET",
            url: "http://localhost:3000/user/" + user._id
          }
        }
      })
    }
    res.status(200).json(response)
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  });
}

exports.signup = (req, res, next) => {  
  User.find({email: req.body.email})
  .exec()
  .then( user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: "Email already exists!"
      });
    }

    else{
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {          
          return res.status(500).json({
            error: err          
          })
        }
        else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            name: req.body.name
          })
    
          user.save()
          .then( result => {
            res.status(201).json({
              message: 'User Created',
              request: {
                type: "POST",
                url: "http://localhost:3000/user/login"
              }
            })
          })
          .catch( err => {
            res.status(500).json({
              error: err
            })
          })
        }
      });
    }
  })
}

exports.login = (req, res, next) => {
  User.find({email: req.body.email})
  .exec()
  .then( user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed!"
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed!"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id
          }, 
          process.env.JWT_KEY, 
          {
            expiresIn: "4h"
          }
        );

        return res.status(200).json({          
          message: "Auth successful!",
          userId: user[0]._id,
          token: token
        });
      }
      return res.status(401).json({
        message: "Auth failed!"
      });
    });    
  })
  .catch( err => {
    res.status(500).json({
      error: err
    })
  });
}