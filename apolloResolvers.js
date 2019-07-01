export default {
    Query: {
        QuoteCollection: (_, args, {db}) => db.collection('quote-collection').find().toArray(), //args:limit
        QuoteCount: (_, args, {db}) => db.collection('quote-collection').count(),
        qod: (_, args, {db}) => db.collection('quote-collection').aggregate([{ $sample: { size: 1 } }]).toArray()[0],

    }
}
