const { resume, getCaseById,  getCaseByName, getCaseByCedula, postRegistro, postUpdate, postSignup} = require('../controllers/api.controller');
const { req_ayud } = require('../controllers/middlewares');
const { validate_id, validate_estado, validate_pass_length, validate_pass_conf, validate_unique_user, validate_cedula } = require('../controllers/validators');
const router = require('express').Router();

router.get('/resume', req_ayud, resume)

router.get('/case-by-id', req_ayud, getCaseById)

router.get('/case-by-name', req_ayud, getCaseByName)

router.get('/case-by-cedula', req_ayud, getCaseByCedula)

router.post('/registro', req_ayud, postRegistro)

router.post('/update-case', req_ayud, validate_id, validate_estado, postUpdate)

router.post('/signup',
  validate_pass_length, validate_pass_conf, validate_unique_user, validate_cedula,
  postSignup
);

module.exports = router;
