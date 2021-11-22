CREATE DATABASE casoscovid;
\c casoscovid

CREATE EXTENSION pgcrypto;

CREATE SCHEMA hospital;

CREATE TABLE IF NOT EXISTS hospital.rol (
  id INT NOT NULL PRIMARY KEY,
  rol VARCHAR(12)
);

CREATE TABLE IF NOT EXISTS hospital.userdata (
  cedula INT NOT NULL PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL,
  apellido VARCHAR(40) NOT NULL,
  rol INT REFERENCES rol (id) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  pass VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS hospital.sexo (
  id INT NOT NULL PRIMARY KEY,
  sexo VARCHAR(12) NOT NULL
);

CREATE TABLE IF NOT EXISTS hospital.resultado (
  id INT NOT NULL PRIMARY KEY,
  resultado VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS hospital.caso (
  id SERIAL NOT NULL PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL,
  cedula INT NOT NULL,
  sexo INT REFERENCES sexo (id) NOT NULL,
  nacimiento DATE NOT NULL,
  residencia VARCHAR(100) NOT NULL,
  trabajo VARCHAR(100),
  examen INT REFERENCES resultado (id) NOT NULL,
  fecha TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS hospital.id_estado (
  id INT NOT NULL PRIMARY KEY,
  estado VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS hospital.estado (
  id INT REFERENCES caso (id) NOT NULL,
  estado INT REFERENCES id_estado (id) NOT NULL,
  creado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO hospital.rol (id, rol) 
  VALUES ('1', 'Admin');

INSERT INTO hospital.rol (id, rol) 
  VALUES ('2', 'Médico');

INSERT INTO hospital.rol (id, rol) 
  VALUES ('3', 'Ayudante');

INSERT INTO hospital.sexo (id, sexo) 
  VALUES ('1', 'Masculino');

INSERT INTO hospital.sexo (id, sexo) 
  VALUES ('2', 'Femenino');

INSERT INTO hospital.sexo (id, sexo) 
  VALUES ('3', 'Otro');

INSERT INTO hospital.userdata (cedula, nombre, apellido, rol, username, pass)
  VALUES (0, 'admin', 'admin', 1, 'admon', crypt('admin1234', gen_salt('bf')));

INSERT INTO hospital.resultado (id, resultado) 
  VALUES ('1', 'Positivo');

INSERT INTO hospital.resultado (id, resultado) 
  VALUES ('2', 'Negativo');

INSERT INTO hospital.id_estado (id, estado) 
  VALUES ('1', 'Tratamiento en casa');

INSERT INTO hospital.id_estado (id, estado) 
  VALUES ('2', 'Tratamiento en hospital');

INSERT INTO hospital.id_estado (id, estado) 
  VALUES ('3', 'En UCI');

INSERT INTO hospital.id_estado (id, estado) 
  VALUES ('4', 'Curado');

INSERT INTO hospital.id_estado (id, estado) 
  VALUES ('5', 'Muerte');