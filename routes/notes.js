const express = require('express');
const router = express.Router();
const moment = require('moment');

const Note = require('../models/notes');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // fetch all notes from the db
  res.send('respond with a resource');
});

router.get('/note/completed', async(req, res, next) => {


  const notesList = await Note.find({'completed': true})
      .catch((error) => {
        console.log(error, 'Promise error: ' + error.message);
      }
  );
  // fetch all completed notes from db
    res.json(notesList);
});

router.get('/note/important', function(req, res, next) {

  // fetch all important notes from db
  res.send('respond with a resource');
});

router.post('/note',
    async (req, res, next) => {

      console.log('test: ', req.body);
      const parsedActiveFromDate = moment(req.body.dueDate);

      if (!parsedActiveFromDate.isValid()) {
        console.warn('Date provided is in a wrong format ' + req.body.activeFrom);
      }

      let note = new Note();
      note.title = req.body.title;
      note.description = req.body.description;
      note.dueDate = parsedActiveFromDate;
      note.importance = req.body.importance;
      note.completed = req.body.completed;


      await note.save(function (err) {
        if (err) {
          console.error(err);
          console.log('save error');
          res.sendStatus(500);
          return;
        }
        res.json({message: 'Note created!'});
      })
});


router.get('/note',
    async (req, res, next) => {

        const notesList = await Note.find({'completed': false})
            .catch((error) => {
                    console.log(error, 'Promise error: ' + error.message);
                }
            );

        res.json(notesList);
    });


module.exports = router;
