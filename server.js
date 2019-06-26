var {MongoClient} = require("mongodb");
var dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var graphqlHTTP = require('express-graphql');
var schema = require('./quoteSchema');
var server = express();
server.use(logger('dev'));

//CORS
var allowedOrigins = ['http://fosteman.info', ''];
server.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg =
          `CORS policy of my api restricts access to my apps, like fosteman.info. 
          To access my api browse graphiqlUI located at https://graphql-api-backend.herokuapp.com/api instead!
          `;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

//MongoDB Backend
MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
  if (err) throw new Error(err.message);
  var db = client.db('NodeWorks');
  console.log('Connected to MongoDB server');
  server.use('/api', graphqlHTTP({
    schema,
    context: {db},
    graphiql: true
  }));
  // catch 404 and forward to error handler
  server.use(function(req, res, next) {
    next(createError(404));
  });
  // error handler
  server.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('500');
  });
  console.log('Running on: ', process.env.URL);
  server.listen(process.env.PORT || 8080);
});
