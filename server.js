const express = require("express");

const expressGraphQL = require("express-graphql").graphqlHTTP;
const Port = 8000;
const schema = require("./schema/schema");
const app = express();
// app.use(express());
const cors = require("cors");
app.use(cors());

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
