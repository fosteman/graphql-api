module.exports = {
    Query: {
        /** Quotes **/
        listQuotes: (_, args, {dataSources}) => dataSources.NodeWorks.collection('quote-collection').find().toArray().map(IdStringifier), //TODO args:limit
        findQuote: (_, args, {dataSources}) => IdStringifier(dataSources.NodeWorks.collection('quote-collection').findOne({_id: args.id})),
        countQuotes: (_, args, {dataSources}) => dataSources.NodeWorks.collection('quote-collection').count(),
        randomQuote: (_, args, {dataSources}) => IdStringifier(dataSources.NodeWorks.collection('quote-collection').aggregate([{ $sample: { size: 1 } }]).toArray()[0]),
        /** Team-Management **/
    }
};

const IdStringifier = o => {
    o._id = o._id.toString();
    return o
};
//asnyc / await?
const resolvers_2 = {
    Query: {
        post: async (root, {_id}) => {
            return prepare(await Posts.findOne(ObjectId(_id)))
        },
        posts: async () => {
            return (await Posts.find({}).toArray()).map(prepare)
        },
        comment: async (root, {_id}) => {
            return prepare(await Comments.findOne(ObjectId(_id)))
        },
    },
    Post: {
        comments: async ({_id}) => {
            return (await Comments.find({postId: _id}).toArray()).map(prepare)
        }
    },
    Comment: {
        post: async ({postId}) => {
            return prepare(await Posts.findOne(ObjectId(postId)))
        }
    },
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
