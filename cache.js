const fs = require('fs');
const path = require('path');
const {introspectionQuery} = require('graphql/utilities');
const {graphql} = require('graphql');
const babelRelayPlugin = require('babel-relay-plugin');
const schema = require('./quoteSchema');

graphql(schema, introspectionQuery)
    .then(result => {
        fs.writeFileSync(
            path.join(__dirname, 'cachedSchema.json'),
            JSON.stringify(result, null, 2)
            );
        console.log('Schema cached!');
    })
    .finally(() => module.exports = babelRelayPlugin(require('./cachedSchema').data))
    .catch(err => console.log('Caching Failed!', err.message));
