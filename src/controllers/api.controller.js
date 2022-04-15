const { response } = require('express');
const pool = require('../database/postgreSQL')
const { validationResult } = require('express-validator');

const resume = async (req,res) => {
  const response = await pool.query(`
    SELECT
      id,
      nombre,
      cedula,
      sexo,
      fecha,
      examen
    FROM
      hospital.caso
    LIMIT 10;
  `)
  res.json(response.rows);
}

const getCaseById = async (req,res) => {
  try {
    const response = await pool.query(
      `SELECT
        c.id,
        c.nombre,
        c.cedula,
        s.sexo,
        c.nacimiento,
        c.residencia,
        c.trabajo,
        r.resultado AS examen,
        c.fecha
      FROM
        hospital.caso c,
        hospital.resultado r,
        hospital.sexo s
      WHERE
        c.sexo=s.id
        AND c.examen=r.id
        AND c.id = '${req.query.id}';`
      )
      res.json(response.rows)
  } catch (error) {
    res.status(400).send('La id no es un numero')
  }
  
}

const getCaseByName = async (req,res) => {
  const response = await pool.query(
    `SELECT
      c.id,
      c.nombre,
      c.cedula,
      s.sexo,
      c.nacimiento,
      c.residencia,
      c.trabajo,
      r.resultado AS examen,
      c.fecha
    FROM
      hospital.caso c,
      hospital.resultado r,
      hospital.sexo s
    WHERE
      c.sexo=s.id
      AND c.examen=r.id
      AND c.nombre = '${req.query.name}';`
    )
    res.json(response.rows)
}


const getCaseByCedula = async (req,res) => {
  try {
    const response = await pool.query(
      `SELECT
        c.id,
        c.nombre,
        c.cedula,
        s.sexo,
        c.nacimiento,
        c.residencia,
        c.trabajo,
        r.resultado AS examen,
        c.fecha
      FROM
        hospital.caso c,
        hospital.resultado r,
        hospital.sexo s
      WHERE
        c.sexo=s.id
        AND c.examen=r.id
        AND c.cedula = '${req.query.cedula}';`
      )
      res.json(response.rows)
  } catch (error) {
    res.status(400).send('La cedula no es un numero')
  }
}

const postRegistro = async (req, res) => {
  const {
    nombre,
    cedula,
    sexo,
    nacimiento,
    residencia,
    trabajo,
    resultado,
    fecha_del_examen,
    hora_del_examen
  } = req.body;
  const fecha = `${fecha_del_examen} ${hora_del_examen}`

  if (req.session.role == 'Ayudante') {
    try {
      await pool.query(
        `INSERT INTO
          hospital.caso (
            nombre,
            cedula,
            sexo,
            nacimiento,
            residencia,
            trabajo,
            examen,
            fecha)
        VALUES (
          '${nombre}',
          '${cedula}',
          '${sexo}',
          '${nacimiento}',
          '${residencia}',
          '${trabajo}',
          '${resultado}',
          '${fecha}')`
        )
      console.log('Nuevo caso creado');
      res.status(200).send('oK')
    } catch (error) {
      res.status(400).json(error)
    }
    
    
  } else res.status(401).redirect('/')

}

const postUpdate = async (req, res) => {
  const {
    ID,
    estado
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors.array())
  await pool.query(`
    INSERT INTO 
      hospital.estado (
        id,
        estado)
      VALUES (
        '${ID}',
        '${estado}')`
    )
  console.log(`Caso ${ID} Actualizado`);
  res.send('ok')
}

const postSignup = async (req, res) => {
  const errors = validationResult(req);
  const {
    name,
    last_name,
    cedula,
    user,
    rol,
    password
  } = req.body;

  if (req.session.role == 'Admin') {
    if (!errors.isEmpty()) return res.status(400).json(errors.array())

    const response = await pool.query(`
      INSERT INTO 
        hospital.userdata (
          cedula,
          nombre,
          apellido,
          rol,
          username,
          pass)
        VALUES (
          '${cedula}',
          '${name}',
          '${last_name}',
          '${rol}',
          '${user}',
          crypt('${password}', gen_salt(\'bf\')) )`
      )

    console.log(`Usuario ${user} creado`);
    if (response) res.send(response)
    else res.status(400).render('sesion/signup', {
      errors: [{
        "msg": "Ha ocurrido un error inesperado"
      }]
    });

  } else res.status(401).send('no tiene permisos')

}

module.exports = {
  resume,
  getCaseById,
  getCaseByName,
  getCaseByCedula,
  postRegistro,
  postUpdate,
  postSignup
}