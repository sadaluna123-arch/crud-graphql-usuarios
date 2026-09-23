// Definición del schema GraphQL
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Usuario {
    id: Int!
    nombre: String!
    correo: String!
    edad: Int!
  }

  input UsuarioInput {
    nombre: String!
    correo: String!
    edad: Int!
  }

  type Query {
    usuarios: [Usuario!]!
    usuario(id: Int!): Usuario
  }

  type Mutation {
    crearUsuario(datos: UsuarioInput!): Usuario
    actualizarUsuario(id: Int!, datos: UsuarioInput!): Usuario
    eliminarUsuario(id: Int!): Usuario
  }
`);

module.exports = schema;
