const pool = require('../database/postgreSQL')
const {
  validationResult
} = require('express-validator');


const getIndex = (req, res) => {
  res.render('index', {
    role: req.session.role
  });
};

const getSignin = (req, res) => {
  if (!req.session.role) res.render('sesion/signin', {
    errors: []
  })
  else res.redirect('/')
}

const postSignin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).render(
        'sesion/signin', 
        {errors: errors.array()}
      );
  
  req.session.role = req.body.rol
  res.redirect('/');  
}

const getSignup = (req, res) => {
  res.render('sesion/signup', {
    errors: []
  })
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
    if (!errors.isEmpty()) return res.status(400).render(
        'sesion/signup',
        {errors: errors.array()}
      );

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
          crypt(${password}, gen_salt(\'bf\')) )`
      )

    console.log(`Usuario ${user} creado`);
    if (response) res.render('sesion/signedup')
    else res.status(400).render('sesion/signup', {
      errors: [{
        "msg": "Ha ocurrido un error inesperado"
      }]
    });

  } else res.status(401).redirect('/')

}

const getRegistro = (req, res) => {
  if (req.session.role == 'Ayudante' || req.session.role == 'Admin') res.render(
      'ayudante/registro', 
      { role: req.session.role }
    )
  else res.status(401).redirect('/')
}

const postRegistro = async (req, res) => {
  const {
    nombre,
    cedula,
    sexo,
    fecha_de_nacimiento,
    direccion_de_residencia,
    direccion_de_trabajo,
    resultado_del_examen,
    fecha_del_examen,
    hora_del_examen
  } = req.body;
  const fecha = `${fecha_del_examen} ${hora_del_examen}`

  if (req.session.role == 'Admin' || req.session.role == 'Ayudante') {
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
        '${fecha_de_nacimiento}',
        '${direccion_de_residencia}',
        '${direccion_de_trabajo}',
        '${resultado_del_examen}',
        '${fecha}')`
      )

    console.log('Nuevo caso creado');
    res.render('ayudante/gracias', {
      role: req.session.role
    })
  } else res.status(401).redirect('/')

}

const getGestion = (req, res) => {
  if (req.session.role == 'Ayudante' || req.session.role == 'Admin') res.render('ayudante/gestion', {
    resultado: [],
    errors: [],
    role: req.session.role,
  })
  else res.status(401).redirect('/')
}

const postGestion = async (req, res) => {
  const {
    type,
    busqueda
  } = req.body;
  let response = undefined

  if (req.session.role == 'Admin' || req.session.role == 'Ayudante') {
    switch (type) {
      case 'id':
        response = await pool.query(
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
            AND c.id = '${busqueda}'';`
          )
        break;
      case 'nombre':
        response = await pool.query(
          `SELECT
            c.id,
            c.nombre,
            c.cedula, s.sexo,
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
            AND c.nombre = '${busqueda}';`
          )
        break;
      case 'cedula':
        response = await pool.query(
          `SELECT
            c.id,
            c.nombre,
            c.cedula, s.sexo,
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
            AND c.cedula = ${busqueda};`
          )
        break;
    }
    res.render('ayudante/gestion', {
      resultado: response.rows,
      errors: [],
      role: req.session.role
    });
  } else res.status(401).redirect('/');
}

const postActualizarCaso = async (req, res) => {
  const {
    ID,
    estado
  } = req.body;
  const errors = validationResult(req);

  if (req.session.role == 'Admin' || req.session.role == 'Ayudante') {

    if (!errors.isEmpty()) return res.status(400).render('ayudante/gestion', 
      { resultado: [],
        errors: errors.array(),
        role: req.session.role
      });
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
    res.render('ayudante/gestion', {
      resultado: [],
      errors: [],
      role: req.session.role
    });
  }else res.status(401).redirect('/')
}

const getLogout = (req, res) => {
  req.session.destroy(null);
  res.redirect('/')
}

const error404 = (req, res) => {
  res.status(404).render('404', {
    role: req.session.role
  });
}

module.exports = {
  getIndex,
  getSignin,
  postSignin,
  getSignup,
  postSignup,
  getRegistro,
  postRegistro,
  getGestion,
  postGestion,
  postActualizarCaso,
  getLogout,
  error404
}