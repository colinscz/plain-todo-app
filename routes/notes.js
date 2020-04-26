var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // fetch all notes from the db
  res.send('respond with a resource');
});

router.get('/completed', function(req, res, next) {

  // fetch all completed notes from db
  res.send('respond with a resource');
});

router.get('/important', function(req, res, next) {

  // fetch all important notes from db
  res.send('respond with a resource');
});

module.exports = router;
