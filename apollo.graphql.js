export default gql`
type Query {
    "Markdown text!"
    allQuotes: [Quote]       
    quoteCount: GraphQLInt
    randomQuote: Quote
}
interface Node {
    id: String!
}
type Quote implements Node {
    id: String!
    text: String
    author: String
}
type Contact {
    firstName: String
    lastName: String
    phoneNumber: String
    extension: String
    email: String
    GitHub: String
}
type Address {
    street: String
    state: String
    city: String
    zip: String
}
type Position {
    id: String!
    name: String
    description: String
    salary: Int
}
type Employee implements Node {
    id: String!
    position: 
    address: Address
    contact: Contact
    hireDate: String
    bonus: Int
}

`;
