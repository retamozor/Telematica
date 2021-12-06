const { resume, getCaseById,  getCaseByName, getCaseByCedula, postRegistro, postUpdate} = require('../controllers/api.controller');
const { req_ayud } = require('../controllers/middlewares');
const { validate_id, validate_estado } = require('../controllers/validators');
const router = require('express').Router();

router.get('/resume', req_ayud, resume)

router.get('/case-by-id', req_ayud, getCaseById)

router.get('/case-by-name', req_ayud, getCaseByName)

router.get('/case-by-cedula', req_ayud, getCaseByCedula)

router.post('/registro', req_ayud, postRegistro)

router.post('/update-case', req_ayud, validate_id, validate_estado, postUpdate)

module.exports = router;
