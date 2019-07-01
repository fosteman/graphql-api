const ObjectId = require("mongodb");
const L = require('lodash');

module.exports = {
    Query: {
        /** Quotes **/
        listQuotes: (_, args, {NodeWorks}) => NodeWorks.collection('quote-collection').find().toArray(),
        //TODO args:limit, stringifyId

        findQuote: (_, args, {NodeWorks}) => ResolveSingleItem(NodeWorks.collection('quote-collection').find()),
//TODO Fix findOne
        countQuotes: (_, args, {NodeWorks}) => NodeWorks.collection('quote-collection').countDocuments(),

        randomQuote: (_, args, {NodeWorks}) => ResolveSingleItem(NodeWorks.collection('quote-collection').aggregate([{$sample: {size: 1}}])),

        /** Team-Management **/

        listEmployees: (_, args, {TeamManagement}) => TeamManagement.collection('employees').find().toArray(),

        listProjects: (_, args, {TeamManagement}) => reMapProjects(TeamManagement.collection('projects').find().toArray()),

    },
};

async function ResolveSingleItem(o) {
    //console.log(o);
    let resolve = await o.toArray();
    console.log(resolve);
    return resolve[0]
}
async function reMapProjects(promise) {
    const map = prj => {
        prj.projectName = prj.ProjectName;
        prj.projectDescription = prj.ProjectDescription;
        prj.projectStartDate = prj.ProjectStartDate;
        prj.projectEndDate = prj.ProjectEndDate;
    };
    let prjArray = await promise;
    console.log('Remapping projects...');
    return L.forEach(prjArray, map);
}

//asnyc / await?
const resolvers_2 = {
    Mutation: {
        createPost: async (root, args, context, info) => {
            const res = await Posts.insertOne(args)
            return prepare(res.ops[0])  // https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertOneWriteOpResult
        },
        createComment: async (root, args) => {
            const res = await Comments.insert(args)
            return prepare(await Comments.findOne({_id: res.insertedIds[1]}))
        },
    },
}
