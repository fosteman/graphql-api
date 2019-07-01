module.exports = require('graphql-tag')`
type Query {
    listQuotes(limit: Int): [Quote!]!
    findQuote(id: String!): Quote
    countQuotes: Int
    randomQuote: Quote!
    
    listEmployees: [Employee!]!
    getEmployeeById(id: String): Employee
}

type Quote {
    _id : String!
    text : String
    author : String
}

type Contact{
    firstName : String
    lastName : String
    phoneNumber : String
    extension : String
    email : String
    GitHub : String
}

type Address{
    street : String
    state : String
    city : String
    zip : String
}

type Position{
    _id : String!
    name : String
    description : String
    salary : Int
}

type Employee{
    _id : String!
    position : Position
    address : Address
    contact : Contact
    hireDate : String
    bonus : Int
}
`;
