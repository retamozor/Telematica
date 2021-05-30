CREATE DATABASE casoscovid;
\c casoscovid

CREATE TABLE userdata (
  id SERIAL NOT NULL PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL,
  apellido VARCHAR(40) NOT NULL,
  rol VARCHAR(40) NOT NULL
);

CREATE TABLE passwords (
  username VARCHAR(50) NOT NULL PRIMARY KEY,
  pass VARCHAR(255) NOT NULL,
  user_id INT REFERENCES userdata (id) NOT NULL
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