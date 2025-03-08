const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = graphql;

const users = [
  {
    id: "23",
    profile:
      "https://images.unsplash.com/photo-1638482856830-16b0e15fcf2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGNvZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    firstName: "Bill",
    age: 20,
  },
  {
    id: "47",
    profile:
      "https://images.unsplash.com/flagged/photo-1563536314719-2e812e896f50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGNvZGluZyUyMGdpcmx8ZW58MHx8MHx8fDA%3D",
    firstName: "Samantha",
    age: 21,
  },
  {
    id: "30",
    profile:
      "https://plus.unsplash.com/premium_photo-1678565869434-c81195861939?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGNvZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    firstName: "Alice",
    age: 25,
  },
];

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    profile: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return users.find((user) => user.id === args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType), // ✅ Returns a list of users
      resolve(parentValue, args) {
        return users; // ✅ Returns all users
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
