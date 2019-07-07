const ObjectID = require('mongodb').ObjectID;
const L = require('lodash');
const l = require('./winston'); //logger

module.exports = {
    Query: {
        /** Quotes **/
        listQuotes: (_, args, {NodeWorks}) => reMapQuotes(NodeWorks.collection('quote-collection').find().toArray()),
        //TODO args:limit, stringifyId

        findQuote: (_, args, {NodeWorks}) => reMapQuotes(NodeWorks.collection('quote-collection').findOne({_id: ObjectID(args.id)})),

        countQuotes: (_, args, {NodeWorks}) => NodeWorks.collection('quote-collection').countDocuments(),

        randomQuote: (_, args, {NodeWorks}) => reMapQuotes(NodeWorks.collection('quote-collection').aggregate([{$sample: {size: 1}}])),

        /** Team-Management **/

        /* Employee */
        employee: async (_, args, {TeamManagement}) => {
            console.log( 'Query:employee');
           return await TeamManagement.collection('employees').findOne({_id: ObjectID(args.id)})
        },

        position: (parent, args, {TeamManagement}) => {
            console.log( 'Query:position',
                TeamManagement.collection('positions').findOne({_id: ObjectID(parent.id)})
            )
        },

        /* Project */


        listEmployees: (_, args, {TeamManagement}) => TeamManagement.collection('employees').find().toArray(),

        listProjects: (_, args, {TeamManagement}) => TeamManagement.collection('projects').find().toArray(),

        listTeams: (_, args, {TeamManagement}) => TeamManagement.collection('teams').find().toArray(),
    },

/*
    Employee: (p, args, {TeamManagement}) => {
        console.log('Employee: fired!');
        return {
            id: p => p._id,
            hireDate: p => p.HireDate,
            bonus: p => p.SalaryBonus,
            firstName: p => p.FirstName,
            lastName: p => p.LastName
        };
    },
*/
    Employee: {
        id: (...p) => {
            l.info('Employee.id fired with args: ', {...p});
            return p._id
        },
        hireDate: p => p.HireDate,
        bonus: p => p.SalaryBonus,
        firstName: p => p.FirstName,
        lastName: p => p.LastName
    },


    Position: (_, args, {TeamManagement}) => {
        console.log( 'Query:project');
        return TeamManagement.collection('projects').findOne({_id: ObjectID(args.id)})
    },
    Project: {
        id: p => p._id,
        name: p => p.ProjectName,
        description: p=> p.ProjectDescription,
        startDate: p=> p.ProjectStartDate,
        endDate: p=> p.ProjectEndDate,
    },
    Team: {

    }
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
    const map = (q) => {
        q.text = q.quoteText;
        q.author = q.quoteAuthor;
        return q;
    };
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

async function reMapEmployees(cursor) {
    let q = await cursor;
    console.log(q);
    const map = e => {
        //contact, address referenced types  must be resolved
        let employee = {
            bonus: e.SalaryBonus,
            hireDate: e.HireDate,
            positionID: e.Position,
        }
        let address = {
            address: e.AddressStreet,
            state: e.AddressState,
            city: e.AddressCity,
            zip: e.AddressZip
        };
        let contact = {
            firstName: e.FirstName,
            lastName: e.lastName,
            phoneNumber: e.PhoneNum,
            extension: e.Extension,

        };





    };
    console.log('Remapping employees...', q);
    return L.forEach(q, map);
}

async function reMapPosition(promise) {
    const map = p => {};
    let position = await promise;
    console.log("Remapping position...", position);
    return position
}





//asnyc / await?
const mutators = {
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
