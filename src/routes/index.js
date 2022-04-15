const router = require('express').Router();
const {
  getIndex,
  getAyudante,
  getSignin,
  postSignin,
  getSignup,
  postSignup,
  getLogout,
  getAdmin
} = require('../controllers/index.conrtoller');
const {is_auth, is_ayud, is_admin} = require('../controllers/middlewares');
const {
  validate_user,
  validate_pass_length,
  validate_pass_conf,
  validate_unique_user,
  validate_cedula
} = require('../controllers/validators');


router.get('/', is_auth, getIndex);

router.get('/', is_ayud, getAyudante);

router.get('/', is_admin, getAdmin);

router.get('/signin', getSignin);

router.post('/signin', validate_user, postSignin);

router.get('/signup', getSignup);

router.post('/signup',
  validate_pass_length, validate_pass_conf, validate_unique_user, validate_cedula,
  postSignup
);

router.get('/logout', getLogout)

module.exports = router