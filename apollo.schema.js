module.exports = require('graphql-tag')`
type Query {
    listQuotes(limit: Int): [Quote!]!
    findQuote(id: String!): Quote
    countQuotes: Int
    randomQuote: Quote!
    
    listEmployees : [Employee!]!
	listProjects : [Project!]!
	listTeams : [Team!]!
	
	employee(id: ID!) : Employee
	project: Project
	
	position: Position
}

type Quote {
    _id : String!
    text : String
    author : String
}

type Employee {
	position : Position
	address : Address
	contact: Contact!
	
	id : ID!
	hireDate : String
	bonus : Int
	firstName: String!
	lastName: String!
}

type Position{
	id : ID!
	name : String
	description : String
	salary : Int
}

type Address{
	street : String
	state : String
	city : String
	zip : String
}

type Contact {
	phoneNumber : String
	extension : String
}

type Project {
	id : ID!
	name : String!
	description : String
	startDate : String
	endDate : String
}

type Team {
	id : ID!
	teamName : String
	Employees : [Employee]
	teamLead : Employee
	Projects : [Project]
}
`;
