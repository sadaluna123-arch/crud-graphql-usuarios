# CRUD de usuarios con GraphQL, React y Apollo Client

Aplicación de una sola página que permite **listar, registrar, editar y eliminar usuarios** desde una interfaz web en React. El frontend consume una API GraphQL (Node.js + Express) conectada a una base de datos MySQL.

```
Interfaz React  →  Apollo Client  →  API GraphQL (Express)  →  MySQL
```

## Autores

- Nicolás Maya
- Santiago Luna

## Tecnologías

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 19, Vite, Apollo Client 4, GraphQL, CSS |
| Backend | Node.js, Express, express-graphql, GraphQL, mysql2, cors, dotenv |
| Base de datos | MySQL 8 (o MariaDB / XAMPP) |

## Puertos utilizados

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend GraphQL / GraphiQL | 4000 | http://localhost:4000/graphql |
| MySQL | 3306 | localhost:3306 |

## Estructura del repositorio

```
crud-graphql-usuarios/
├── backend/
│   ├── sql/database.sql      # Crea la base de datos, la tabla y datos de ejemplo
│   ├── db.js                 # Conexión a MySQL (pool)
│   ├── schema.js             # Schema GraphQL (Usuario, UsuarioInput, Query, Mutation)
│   ├── resolvers.js          # Lógica de cada query y mutation
│   ├── index.js              # Servidor Express + CORS + /graphql
│   └── .env.example          # Variables de conexión
└── frontend-usuarios/
    └── src/
        ├── main.jsx                      # ApolloClient + ApolloProvider
        ├── App.jsx                       # Integra formulario, tabla y mensajes
        ├── App.css                       # Estilos y diseño adaptable
        ├── graphql/operaciones.js        # Query y mutations
        ├── graphql/errores.js            # Mensajes de error comprensibles
        └── components/
            ├── ListaUsuarios.jsx         # Tabla + eliminar
            ├── FormularioUsuario.jsx     # Crear / editar
            └── Mensaje.jsx               # Avisos de éxito y error
```

## Requisitos previos

- [Node.js](https://nodejs.org) 20 o superior (incluye npm)
- MySQL 8 (MySQL Server, MySQL Workbench o XAMPP)
- Git

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPOSITORIO>
cd crud-graphql-usuarios
```

### 2. Crear la base de datos

Ejecute el script `backend/sql/database.sql` en MySQL Workbench / phpMyAdmin, o desde la terminal:

```bash
mysql -u root -p < backend/sql/database.sql
```

### 3. Configurar y ejecutar el backend (terminal 1)

```bash
cd backend
npm install
cp .env.example .env      # En Windows: copy .env.example .env
```

Edite `.env` con el usuario y la contraseña de su MySQL y luego:

```bash
npm start
# Servidor GraphQL listo en http://localhost:4000/graphql
```

Pruebe en GraphiQL (http://localhost:4000/graphql):

```graphql
query { usuarios { id nombre correo edad } }
```

### 4. Ejecutar el frontend (terminal 2)

```bash
cd frontend-usuarios
npm install
npm run dev
```

Abra http://localhost:5173.

> El backend y el frontend deben estar activos al mismo tiempo, cada uno en su propia terminal.

## API GraphQL

```graphql
type Usuario { id: Int!  nombre: String!  correo: String!  edad: Int! }
input UsuarioInput { nombre: String!  correo: String!  edad: Int! }

type Query {
  usuarios: [Usuario!]!
  usuario(id: Int!): Usuario
}

type Mutation {
  crearUsuario(datos: UsuarioInput!): Usuario
  actualizarUsuario(id: Int!, datos: UsuarioInput!): Usuario
  eliminarUsuario(id: Int!): Usuario
}
```

## Requerimientos funcionales cubiertos

| RF | Descripción | Dónde |
|----|-------------|-------|
| RF1 | Tabla con los registros obtenidos por una query | `ListaUsuarios.jsx` (`useQuery`) |
| RF2 | Registro mediante formulario controlado | `FormularioUsuario.jsx` (`useState`) |
| RF3 | Seleccionar un registro y cargarlo para editar | botón **Editar** + `useEffect` |
| RF4 | Actualización mediante mutation | `ACTUALIZAR_USUARIO` |
| RF5 | Confirmación antes de eliminar | `confirm()` + `ELIMINAR_USUARIO` |
| RF6 | Estados de carga, éxito y error | "Cargando...", `Mensaje.jsx`, panel de error |
| RF7 | Lista actualizada sin recargar el navegador | `refetchQueries` |
| RF8 | Diseño legible y adaptable | `App.css` (media query ≤ 700 px) |

## Pruebas funcionales

| Prueba | Acción | Resultado |
|--------|--------|-----------|
| PF1 | Listar usuarios | La tabla muestra los registros de MySQL |
| PF2 | Registrar usuario | Aparece en la tabla y en MySQL, con mensaje de éxito |
| PF3 | Validar formulario | No se envían campos vacíos ni edades menores a 1 |
| PF4 | Editar usuario | El formulario carga los datos y la tabla refleja el cambio |
| PF5 | Eliminar usuario | Se pide confirmación y el registro desaparece |
| PF6 | Backend detenido | Se muestra "No hay conexión con el servidor GraphQL" y un botón Reintentar |

Adicional: si se intenta registrar un correo repetido, la interfaz muestra "Ya existe un usuario con ese correo".

## Errores frecuentes

| Situación | Solución |
|-----------|----------|
| `Failed to fetch` | El backend no está activo, la URL es incorrecta o falta CORS |
| `Access denied for user 'root'` | Revise `DB_USER` y `DB_PASSWORD` en `backend/.env` |
| `Unknown database 'crud_graphql'` | Ejecute `backend/sql/database.sql` |
| `Cannot find package` | Ejecute `npm install` dentro de la carpeta correcta |
| `Expected type Int` | `id` y `edad` se convierten con `Number()` antes de enviarse |
