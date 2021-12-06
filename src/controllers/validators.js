const pool = require('../database/postgreSQL')
const {
  body
} = require('express-validator');

const validate_user = body('user').custom(async (user, {req}) => {
  const response = await pool.query(`
    SELECT
      r.rol,
      u.nombre,
      u.apellido,
      u.cedula
    FROM
      hospital.rol r,
      hospital.userdata u
    WHERE 
      u.rol=r.id
      AND u.username='${user}'
      AND u.pass = crypt( '${req.body.password}', u.pass);`
    )
  if (response.rows.length == 0) throw new Error('Usuario y/ó contraseña incorectos');

  req.session.role = response.rows[0].rol;
  req.session.name = response.rows[0].nombre;
  req.session.last_name = response.rows[0].apellido;
  req.session.cedula = response.rows[0].cedula;
  
  
  return true
})

const validate_pass_length = body('password').isLength({min: 8})
  .withMessage('La contraseña debe ser de 8 caracteres como minimo');

const validate_pass_conf = body('pass_confirm').custom((pass_confirm, { req }) => {
  if (pass_confirm !== req.body.password) throw new Error('Las Conraseñas no coinciden');
  return true;
});

const validate_unique_user = body('user').custom(async user => {
  const response = await pool.query(`
    SELECT
      username
    FROM
      hospital.userdata
    WHERE username='${user}'`
    )

  if (response.rowCount != 0) throw new Error(`El usuario '${user}' ya ha sido registrado`);
  return true
})

const validate_cedula = body('cedula').custom(async cedula => {
  const response = await pool.query(`
    SELECT
      cedula
    FROM
      hospital.userdata
    WHERE cedula='${cedula}'`
    )

  if (response.rowCount != 0) throw new Error(`La cédula '${cedula}' ya ha sido registrada`);
  return true
})

const validate_estado = body('estado').custom(async (estado, { req }) => {
  const result = await pool.query(
    `SELECT
      examen
    FROM
      hospital.caso
    WHERE
      id='${req.body.ID}'`
  )
  if (result.rowCount == 0) return true

  if (result.rows[0].examen == 2) throw new Error('El paciente no tiene COVID')

  const lastEstado = await pool.query(
    `SELECT i.estado
    FROM 
      hospital.estado e1,
      hospital.id_estado i,
      hospital.caso c,
      hospital.resultado r
    WHERE 
      e1.estado=i.id 
      AND e1.id=c.id 
      AND c.examen=r.id 
      AND c.id='${req.body.ID}'
      AND NOT EXISTS (
          SELECT *
          FROM hospital.estado e2
          WHERE e2.creado > e1.creado
      )`
  )
  if (lastEstado.rows[0].estado == 'Muerte') throw new Error('El paciente ya murió')

  return true
})

const validate_id = body('ID').custom( async ID => {
  const response = await pool.query(
    `SELECT id
    FROM hospital.caso
    WHERE id='${ID}'`
  )

  if (response.rowCount == 0) throw new Error(`no existe un caso con la id ${ID}`)
})

module.exports = {
  validate_user,
  validate_pass_length,
  validate_pass_conf,
  validate_unique_user,
  validate_cedula,
  validate_estado,
  validate_id
}