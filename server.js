var {MongoClient} = require("mongodb");
var dotenv = require('dotenv');
var result = dotenv.config();
if (result.error) throw result.error;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var graphqlHTTP = require('express-graphql');
var schema = require('./quoteSchema');
var server = express();
server.use(logger('dev'));

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
