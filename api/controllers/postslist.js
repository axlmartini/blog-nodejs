const PostList = require('../models/postlist');
const mongoose = require('mongoose');

exports.getAll = (req, res, next) => {
  PostList.find()
  .exec()
  .then( posts => {  
    const response = {
      count: posts.length,
      posts: posts.map(post => {
        return {
          _id : post._id,
          title: post.title, 
          content: post.content,
          request: {
            type: "GET",
            url: "http://localhost:3000/posts/" + post._id
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

exports.postCreate = (req, res, next) => {  
  const posts = new PostList({
    _id: new mongoose.Types.ObjectId(),    
    title: req.body.title,
    content: req.body.content,
  })
  posts.save()
  .then( post => {
    res.status(201).json({
      message: "New Post",
      postDetails: {
        _id:  post._id,
        title: post.title, 
        request: {
          type: "GET",
          url: "http://localhost:3000/posts/" + post._id
        }
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  });
}

exports.postGetSingle = (req, res, next) => {
  const id = req.params.postId;
  PostList.findById(id)
  .select('title content')
  .exec()
  .then(post => {
    if (post) {
      res.status(200).json(post)
    }
    else {
      res.status(404).json({
        message: "No Posts"
      })
    }  
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    });
  });
}

exports.postUpdate = (req, res, next) => {
  const id = req.params.postId;  
  PostList.findById(id)
  .exec()
  .then( post => {
    PostList.updateOne({ _id: post.id }, { $set: req.body })
      .exec()
      .then( post => {
        res.status(200).json({
          message: "Updated successfully",
          request: {
            type: "GET",
            url: "http://localhost:3000/posts/" + req.params.postId
          }
        });
      })
  })
  .catch( err => {
    res.status(500).json({
      error: err
    })
  });
}

exports.postDelete = (req, res, next) => {
  const id = req.params.postId;
  PostList.findById(id)
  .exec()
  .then( post => {
    PostList.remove({_id: id})
    .exec()
    .then( result => {
      res.status(200).json({
        message: "Post Deleted"
      });
    })  
  })
  .catch( err => {
    res.status(500).json({
      error: err
    })
  });
}