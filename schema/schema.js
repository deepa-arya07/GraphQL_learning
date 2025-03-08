const graphql = require("graphql");
const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = graphql;

// const users = [
//   {
//     id: "23",
//     profile:
//       "https://images.unsplash.com/photo-1638482856830-16b0e15fcf2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGNvZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
//     firstName: "Bill",
//     age: 20,
//   },
//   {
//     id: "47",
//     profile:
//       "https://images.unsplash.com/flagged/photo-1563536314719-2e812e896f50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGNvZGluZyUyMGdpcmx8ZW58MHx8MHx8fDA%3D",
//     firstName: "Samantha",
//     age: 21,
//   },
//   {
//     id: "30",
//     profile:
//       "https://plus.unsplash.com/premium_photo-1678565869434-c81195861939?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGNvZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
//     firstName: "Alice",
//     age: 25,
//   },
// ];

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
        // return users.find((user) => user.id === args.id); // this is when we have the user object hard-coded
        return axios
          .get(`http://localhost:5000/users/${args.id}`)
          .then((response) => console.log(response.data));
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return axios
          .get("http://localhost:5000/users")
          .then((response) => response.data); // ✅ Fix: Fetching from JSON server
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
