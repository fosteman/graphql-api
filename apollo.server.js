const {MongoClient} = require("mongodb");
const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./apollo.schema');
const resolvers = require('./apollo.resolvers');

const app = express();

//CORS
const allowedOrigins = ['http://fosteman.info'];
const corsConfig = cors({
    origin: function(origin, callback){
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // if (allowedOrigins.indexOf(origin) === -1) {
        //   var msg =
        //       `CORS policy of my api restricts access to my apps, like fosteman.info.
        //       To access my api browse graphiqlUI located at https://graphql-api-backend.herokuapp.com/api instead!
        //       `;
        //   return callback(new Error(msg), false);
        // }
        return callback(null, true);
    }
});
app.options('*', corsConfig);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: async () => {
        let MongoBackend = await MongoClient.connect(
            process.env.MONGODB_URI,
            { useNewUrlParser: true },
            (err, client) => (err) ?
                new Error(err.message) :
                console.log('Connected to MongoDB backend.')
        );
        return {
            NodeWorks: MongoBackend.db('NodeWorks'),
            TeamManagement: MongoBackend.db('teams-api-data') // new db 'TeamManagement' is upcoming
        };
    }
});

server.applyMiddleware({ app, path: '/api' });

app.listen(process.env.PORT || 3006,() => {
    console.log(`🚀 Server ready`);
});
