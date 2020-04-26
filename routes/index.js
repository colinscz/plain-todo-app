var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/new', function(req, res, next) {
  res.render('new', { title: 'Express' });
});

router.get('/notes', function(req, res, next) {
  res.render('notes', { title: 'Express' });
});

module.exports = router;
