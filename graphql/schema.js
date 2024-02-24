const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post]!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type AuthData {
        token: String!
        userId: String!
    }
  

    type RootQuery {
        getUsers: [User]
        getPosts: [Post]
    }
    
    type RootMutation {
        createUser(userInput: UserInputData): User!
        login(email: String!, password: String!): AuthData!
    }
   
    schema {
        query : RootQuery
        mutation: RootMutation
    }
   
`);

//we can also define the query and mutation like this:
// type Query {
//     getUsers: [User]
//     getPosts: [Post]
// }

// type Mutation {
//     createUser(userInput: UserInputData): User
// }
