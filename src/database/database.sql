CREATE DATABASE casoscovid;
\c casoscovid

CREATE EXTENSION pgcrypto;

CREATE TABLE userdata (
  cedula INT NOT NULL PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL,
  apellido VARCHAR(40) NOT NULL,
  rol VARCHAR(40) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  pass VARCHAR(255) NOT NULL
);

CREATE TABLE examen (
  id SERIAL NOT NULL PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL,
  cedula INT NOT NULL,
  sexo VARCHAR(1) NOT NULL,
  nacimiento DATE NOT NULL,
  residencia VARCHAR(100) NOT NULL,
  trabajo VARCHAR(100),
  examen VARCHAR(1) NOT NULL,
  fecha TIMESTAMP NOT NULL
);

CREATE TABLE caso (
  id_caso INT REFERENCES examen (id) NOT NULL,
  estado VARCHAR(30) NOT NULL,
  creado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);