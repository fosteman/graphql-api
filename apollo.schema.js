module.exports = require('graphql-tag')`
type Query {
    listQuotes(limit: Int): [Quote!]!
    findQuote(id: String!): Quote
    countQuotes: Int
    randomQuote: Quote!
    """Employees"""
    listEmployees : [Employee!]!
	listProjects : [Project!]!
	listTeams : [Team!]!
	getEmployeeById(id:String) : Employee
}

type Quote {
    _id : String!
    text : String
    author : String
}

type Employee{
	_id : String!
	position : Position
	address : Address
	contact : Contact
	hireDate : String
	bonus : Int
}

type Position{
	_id : String!
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

type Contact{
	firstName : String
	lastName : String
	phoneNumber : String
	extension : String
	email : String
	gitHub : String
}

type Project {
	_id : String!
	projectName : String!
	projectDescription : String
	projectStartDate : String!
	projectEndDate : String
}

type Team{
	_id : String!
	TeamName : String
	Projects : [Project]
	Employees : [Employee]
	TeamLead : Employee
}
`;
