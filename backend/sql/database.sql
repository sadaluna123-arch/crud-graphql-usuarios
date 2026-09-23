-- Base de datos para la API GraphQL de usuarios
SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS crud_graphql
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE crud_graphql;

CREATE TABLE IF NOT EXISTS usuarios (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  nombre  VARCHAR(100) NOT NULL,
  correo  VARCHAR(150) NOT NULL UNIQUE,
  edad    INT NOT NULL CHECK (edad > 0)
);

INSERT IGNORE INTO usuarios (nombre, correo, edad) VALUES
  ('Ana Gómez',      'ana.gomez@correo.com',      22),
  ('Carlos Pérez',   'carlos.perez@correo.com',   25),
  ('Laura Martínez', 'laura.martinez@correo.com', 21);
