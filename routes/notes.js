var express = require('express');
var router = express.Router();

const Note = require('../models/notes');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // fetch all notes from the db
  res.send('respond with a resource');
});

router.get('/completed', async(req, res, next) => {


  await Note.find({'completed': true})
      .catch((error) => {
        console.log(error, 'Promise error: ' + error.message);
      }
  );
  // fetch all completed notes from db
  res.send('respond with a resource');
});

router.get('/important', function(req, res, next) {

  // fetch all important notes from db
  res.send('respond with a resource');
});

router.post('/note',
    async (req, res) => {

      let parsedActiveFromDate = moment(req.body.dueDate);

      if (!parsedActiveFromDate.isValid()) {
        console.warn('Date provided is in a wrong format ' + req.body.activeFrom);
      }

      let note = new Note();
      note.title = req.body.title;
      note.description = req.body.description;
      note.dueDate = req.body.dueDate;
      note.importance = req.body.importance;


      await note.save(function (err) {
        if (err) {
          console.error(err);
          console.log('save error');
          res.sendStatus(500);
          return;
        }
        res.json({message: 'Note created!'});
      })
})
module.exports = router;
