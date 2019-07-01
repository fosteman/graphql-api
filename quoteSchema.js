

const {GraphQLInterfaceType, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt} = require("graphql");

const QuoteType = new GraphQLObjectType({
    name: 'Quote',
    fields: {
        id: {
            type: GraphQLString,
            resolve: q => q._id
        },
        text: {
            type: GraphQLString,
            resolve: t => t.quoteText
        },
        author: {
            type: GraphQLString,
            resolve: t => t.quoteAuthor
        }
    }
});

const ContactType = new GraphQLObjectType({
    name: 'Contact data',
    fields: {
        firstName: {
            type: GraphQLString
        },
        lastName: {
            type: GraphQLString
        },
        phoneNumber: {
            type: GraphQLString
        },
        extension: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        github: {
            type: GraphQLString
        }
    }
});

const AddressType = new GraphQLObjectType({
    name: 'Location',
    fields: {
        street: {
            type: GraphQLString,
        },
        state: {
            type: GraphQLString,
        },
        city: {
            type: GraphQLString,
        },
        zip: {
            type: GraphQLString,
        },
        formatted: {
            type: GraphQLString,
            resolve: a => a.street + ' ' + a.city + ' ' + a.zip + ' ' + a.state
        }
    }
});

const PositionType = new GraphQLObjectType({
    name: 'Position - Job',
    fields: {
        id: {
            type: GraphQLString,
            resolve: e => e._id
        },
        name: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
        salary: {
            type: GraphQLInt,
        }
    }

});

const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: {
        id: {
            type: GraphQLString,
            resolve: e => e._id
        },
        contact: {
            type: ContactType,
        },
        position: {
            type: PositionType,
        },
        address: {
            type: AddressType
        },
        hireDate: {
            type: GraphQLString,
        },
        bonus: {
            type: GraphQLInt
        }
    }
});

const quoteInterface = new GraphQLInterfaceType({
    name: 'QuoteInterface',
    fields: {
        allQuotes: {
            type: new GraphQLList(QuoteType),
            description: 'A list of all available quotes',
        },
        quoteCount: {
            type: GraphQLInt,
            description: 'Count of all stored quotes',
        },
        randomQuote: {
            type: GraphQLList(QuoteType),
            description: 'Returns a randomly picked quote',
        }
    }
});

const quoteGenerator = new GraphQLObjectType({
    name: 'QuoteGenerator',
    description: 'This subtree refers to @timfosteman/quote-generator npm package.',
    fields: () => ({
        allQuotes: {
            type: new GraphQLList(QuoteType),
            resolve: (_, args, {db}) => db.collection('quote-collection').find().toArray()
        },
        quoteCount: {
            type: GraphQLInt,
            resolve: (_, args, {db}) => db.collection('quote-collection').count()
        },
        randomQuote: {
            type: GraphQLList(QuoteType),
            resolve: (_, args, {db}) => db.collection('quote-collection').aggregate([{ $sample: { size: 1 } }]).toArray()
        }
    })
});

const queryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        quoteGenerator: {
            type: quoteInterface
        }
    }

});

const schema = new GraphQLSchema({
    query: queryType
});

module.exports = schema;
