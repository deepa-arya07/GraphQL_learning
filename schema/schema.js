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
const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    profile: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        if (!parentValue.companyId) return null; // ✅ Fix: Avoid sending requests if companyId is missing
        return axios
          .get(`http://localhost:5000/companies/${parentValue.companyId}`)
          .then((res) => res.data)
          .catch((err) => {
            console.error("Company Not Found:", err.message);
            return null; // ✅ Return null if company does not exist
          });
      },
    },
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
          .then((response) => response.data);
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:5000/companies/${args.id}`)
          .then((response) => response.data);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        if (args.id) {
          return axios
            .get(`http://localhost:5000/users/${args.id}`)
            .then((response) => [response.data]); // ✅ Return an array since users is a list
        }
        return axios
          .get("http://localhost:5000/users")
          .then((response) => response.data);
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});

// ��️ Example GraphQL Query
// 🛠️ How It Works
// When a query like this is made:
// {
//   user(id: "23") {
//     id
//     firstName
//     age
//   }
// }

// The resolve function in GraphQL determines how the data for a particular field should be fetched. It tells GraphQL where and how to retrieve the required data when a query is made.

// //2 GraphQL calls the resolve function inside the user field.
// //3 Inside resolve, axios.get(...) makes an HTTP request to fetch user data from http://localhost:5000/users/23.
// //4 When the data is received, response.data is returned.
// //5GraphQL sends this data back to the client.
