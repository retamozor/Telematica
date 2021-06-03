const router = require('express').Router();
const pool = require('../database/postgreSQL')
const {
  body,
  validationResult
} = require('express-validator');

router.get('/', (req, res) => {
  res.render('index', {
    role: req.session.role
  })
});

router.get('/signin', (req, res) => {
  if (!req.session.role) res.render('signin', {
    errors: []
  })
  else res.redirect('/')
});

router.post('/signin',
  body('user').custom(async (user, {
    req
  }) => {
    const response = await pool.query('SELECT rol FROM userdata WHERE username=$1 AND pass = crypt( $2, pass);', [user, req.body.password])
    if (response.rows.length == 0) {
      throw new Error('Usuario y/ó contraseña incorectos');
    } else {
      req.body.rol = response.rows[0].rol;
    }
    return true
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('signin', {
        errors: errors.array()
      });
    } else {
      req.session.role = req.body.rol
      res.redirect('/');
    }
  });

router.get('/signup', (req, res) => {
  res.render('signup', {
    errors: []
  })
});

router.post('/signup',
  body('password').isLength({
    min: 8
  }).withMessage('La contraseña debe ser de 8 caracteres como minimo'),
  body('pass_confirm').custom((value, {
    req
  }) => {
    if (value !== req.body.password) {
      throw new Error('Las Conraseñas no coinciden');
    }
    return true;
  }),
  body('user').custom(async user => {
    const response = await pool.query('SELECT username FROM userdata WHERE username=$1', [user])
    if (response.rows.length != 0) {
      throw new Error(`El usuario '${user}' ya ha sido registrado`);
    }
    return true
  }),
  body('cedula').custom(async cedula => {
    const response = await pool.query('SELECT cedula FROM userdata WHERE cedula=$1', [cedula])
    if (response.rows.length != 0) {
      throw new Error(`La cédula '${cedula}' ya ha sido registrada`);
    }
    return true
  }),
  async (req, res) => {
    if (req.session.role == 'Admin') {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render('signup', {
          errors: errors.array()
        });
      } else {
        const {
          name,
          last_name,
          cedula,
          user,
          rol,
          password
        } = req.body;

        const response = await pool.query('INSERT INTO userdata (cedula, nombre, apellido, rol, username, pass) VALUES ($1, $2, $3, $4, $5, crypt($6, gen_salt(\'bf\')) )', [cedula, name, last_name, rol, user, password])

        if (response) res.render('signedup')
        else res.status(400).render('signup', {
          errors: [{
            "msg": "Ha ocurrido un error inesperado"
          }]
        });

      }
    } else res.status(401).redirect('/')

  }
);

router.get('/examen', (req, res) => {
  if (req.session.role == 'Ayudante' || req.session.role == 'Admin') res.render('examen', {
    role: req.session.role
  })
  else res.status(401).redirect('/')
});

router.post('/examen', async (req, res) => {
  if (req.session.role == 'Admin' || req.session.role == 'Ayudante') {
    const {
      nombre,
      cedula,
      sexo,
      fecha_de_nacimiento,
      direccion_de_residencia,
      direccion_de_trabajo,
      resultado_del_examen,
      fecha_del_examen
    } = req.body;

    await pool.query('INSERT INTO examen (nombre, cedula, sexo, nacimiento, residencia, trabajo, examen, fecha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [nombre,
        cedula,
        sexo,
        fecha_de_nacimiento,
        direccion_de_residencia,
        direccion_de_trabajo,
        resultado_del_examen,
        fecha_del_examen
      ])
    res.render('gracias',{role:req.session.role})
  } else res.status(401).redirect('/')

});

router.get('/gestion', (req, res) => {
  if (req.session.role == 'Medico' || req.session.role == 'Admin') res.render('gestion', {
    resultado: [],
    role: req.session.role,
  })
  else res.status(401).redirect('/')

});

router.post('/gestion', async (req, res) => {
  if (req.session.role == 'Admin' || req.session.role == 'Medico') {
    console.log(req.body);
    const {
      type,
      busqueda,
      ID,
      estado,
      submit
    } = req.body;
    switch (submit) {
      case 'buscar':

        let response = undefined
        switch (type) {
          case 'id':
            response = await pool.query('SELECT * FROM examen WHERE id = $1;', [busqueda])
            break;
          case 'nombre':
            response = await pool.query('SELECT * FROM examen WHERE nombre = $1;', [busqueda])
            break;
          case 'cedula':
            response = await pool.query('SELECT * FROM examen WHERE cedula = $1;', [busqueda])
            break;
        }
        res.render('gestion', {
          resultado: response.rows,
          role: req.session.role
        })
        break;

      case 'estado':
        await pool.query('INSERT INTO caso (id_caso, estado) VALUES ($1, $2)', [ID, estado])
        res.render('gestion', {
          resultado: [],
          role: req.session.role
        })
        break;
    }


    
  } else res.status(401).redirect('/')

});

router.get('/logout', (req, res) => {
  req.session.destroy(null);
  res.redirect('/')
})

module.exports = router