const router = require('express').Router();
const {
  getIndex,
  getAyudante,
  getSignin,
  postSignin,
  getSignup,
  postSignup,
  getGestion,
  postGestion,
  getLogout,
  getRegistro,
  postRegistro,
  postActualizarCaso
} = require('../controllers/index.conrtoller');
const {is_auth, is_ayud} = require('../controllers/middlewares');
const {
  validate_user,
  validate_pass_length,
  validate_pass_conf,
  validate_unique_user,
  validate_cedula,
  validate_estado,
  validate_id
} = require('../controllers/validators');


router.get('/', is_auth, getIndex);

router.get('/', is_ayud, getAyudante);

router.get('/signin', getSignin);

router.post('/signin', validate_user, postSignin);

router.get('/signup', getSignup);

router.post('/signup',
  validate_pass_length, validate_pass_conf, validate_unique_user, validate_cedula,
  postSignup
);

router.get('/registro', getRegistro);

router.post('/registro', postRegistro);

router.get('/gestion', getGestion);

router.post('/gestion', postGestion);

router.post('/actualizar-caso', validate_id, validate_estado, postActualizarCaso)

router.get('/logout', getLogout)

module.exports = router