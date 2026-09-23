// Servidor Express que expone la API GraphQL en /graphql
require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const root = require('./resolvers');

const app = express();
app.use(cors()); // Permite que React (puerto 5173) consuma la API (puerto 4000)

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Servidor GraphQL listo en http://localhost:${PORT}/graphql`);
});
