const {MongoClient} = require("mongodb");
const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = require('./apollo.graphql.js');

const resolvers = require('./apolloResolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            connectBackend()
        };
    },
    context: ({ foo: 'bar'})
});

//CORS
const allowedOrigins = ['http://fosteman.info'];
server.use(cors({
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
}));

const connectBackend = async () => await
    MongoClient.connect(process.env.MONGODB_URI,
        { useNewUrlParser: true },
        (err, client) => {
            if (err) throw new Error(err.message);
            const db = client.db('NodeWorks');
            console.log('Connected to MongoDB server');
            //Create API endpoint
            server.use('/api', graphqlHTTP({
                schema,
                context: {db},
                graphiql: true
            }));

            //Run the service
            server.listen(process.env.PORT || 8080);
        });
connectBackend();
