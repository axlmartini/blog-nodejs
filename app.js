const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./api/routes/post');
const userRoutes = require('./api/routes/user');

// Mongo DB Connect
mongoose.connect(
'mongodb+srv://admin:'+ process.env.MONGO_ATLAS_PW +'@odd-jobs.5rt87.mongodb.net/oddJobDB?retryWrites=true&w=majority',
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);
mongoose.Promise = global.Promise;

// Logger
app.use(morgan('dev'));

// Set uploads folder to public granting access using the image path
app.use('/uploads' ,express.static('uploads'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes Middleware
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app;