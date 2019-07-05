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

        getEmployee: (_, args, {TeamManagement}) => {
            let employee = reMapEmployees(TeamManagement.collection('employees').findOne({_id: ObjectID(args.id)}));
            let position = ResolveSingleItem(TeamManagement.collection('positions').findOne({_id: ObjectID(args.id)}));
            return employee;
        },

        position: (_, args, {TeamManagement}) => reMapPosition(TeamManagement.collection('positions').findOne({_id: ObjectID(args.id)})),
    },
};

async function ResolveSingleItem(o) {
    let resolve = await o.toArray();
    console.log('Resolving type: ...', resolve);
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
    console.log('Remapping teams...');
    return L.forEach(teamArray, map);
}

async function reMapQuotes(cursor) {
    function map(q) {
        q.text = q.quoteText;
        q.author = q.quoteAuthor;
        return q;
    }
    let q = await cursor.toArray();
    if (L.isArray(q) && q.length !== 1) {
        console.log('Remapping type: quote...', q);
        return L.forEach(q, map);
    } else if (q.length === 1) {
        return L.forEach(q, map)[0];
    } else {
        console.error('reMapQuotes received cursor and not array!');
    }
    }
async function reMapEmployees(promise) {
    const map = e => {
    };
    let employeeArray = await promise;
    //console.log(teamArray);
    console.log('Remapping employees...', employeeArray);
    return L.forEach(employeeArray, map);
}

async function reMapPosition(promise) {
    const map = p => {};
    let position = await promise;
    console.log("Remapping position...", position);
    return position
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
