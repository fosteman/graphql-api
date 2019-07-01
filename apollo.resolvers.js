const ObjectID = require('mongodb').ObjectID;
const L = require('lodash');

module.exports = {
    Query: {
        /** Quotes **/
        listQuotes: (_, args, {NodeWorks}) => reMapQuotes(NodeWorks.collection('quote-collection').find().toArray()),
        //TODO args:limit, stringifyId

        findQuote: (_, args, {NodeWorks}) => reMapQuotes(NodeWorks.collection('quote-collection').findOne({_id: ObjectID(args.id)})),

        countQuotes: (_, args, {NodeWorks}) => NodeWorks.collection('quote-collection').countDocuments(),

        randomQuote: (_, args, {NodeWorks}) => reMapQuotes(NodeWorks.collection('quote-collection').aggregate([{$sample: {size: 1}}])),

        /** Team-Management **/

        listEmployees: (_, args, {TeamManagement}) => TeamManagement.collection('employees').find().toArray(),

        listProjects: (_, args, {TeamManagement}) => reMapProjects(TeamManagement.collection('projects').find().toArray()),

        listTeams: (_, args, {TeamManagement}) => reMapTeams(TeamManagement.collection('teams').find().toArray()),

        getEmployeeById: (_, args, {TeamManagement}) => reMapQuotes(NodeWorks.collection('quote-collection').findOne({_id: ObjectID(args.id)})),



    },
};

async function ResolveSingleItem(o) {
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

async function reMapTeams(promise) {
    const map = team => {
        team.teamName = team.TeamName;
        team.teamLead = team.TeamLead;
    };
    let teamArray = await promise;
    //console.log(teamArray);
    console.log('Remapping teams...');
    return L.forEach(teamArray, map);
}

async function reMapQuotes(data) {
    let quotes = await data;
    const map = q => {
        q.text = q.quoteText;
        q.author = q.quoteAuthor;
        return q;
    };
    console.log('Remapping quotes...');
    if (quotes && L.isArray(quotes))
        return L.forEach(quotes, map);
     else
        return map(quotes);
};

async function reMapEmployees(promise) {
    const map = e => {
        e.position.name = e.TeamName;
    };
    let teamArray = await promise;
    //console.log(teamArray);
    console.log('Remapping teams...');
    return L.forEach(teamArray, map);
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
