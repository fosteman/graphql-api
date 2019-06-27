const fs = require('fs');
const path = require('path');
const {introspectionQuery} = require('graphql/utilities');
const {graphql} = require('graphql');

const schema = require('./quoteSchema');

graphql(schema, introspectionQuery)
    .then(result => {
        fs.writeFileSync(
            path.join(__dirname, 'cachedSchema.json'),
            JSON.stringify(result, null, 2)
            );
        console.log('Cached schema');
    })
    .catch(err => console.log('Caching Failed!', err.message));
