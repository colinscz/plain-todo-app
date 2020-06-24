const express = require('express');
const router = express.Router();
const moment = require('moment');
const dtoMapper = require('../dto/dtoMapper');
const Note = require('../models/notes');
const noteStore = require('../services/noteStore');


router.get('/note/completed', async(req, res, next) => {

  const notesList = await Note.find({'completed': true})
      .catch((error) => {
        console.log(error, 'Promise error: ' + error.message);
      }
  );
  // fetch all completed notes from db
    res.status(200).json(notesList);
});

router.post('/note',
    async (req, res, next) => {

      const parsedActiveFromDate = moment(req.body.dueDate);

      if (!parsedActiveFromDate.isValid()) {
        console.warn('Date provided is in a wrong format ' + req.body.dueDate);
      }

      let note = new Note();
      note.title = req.body.title;
      note.description = req.body.description;
      note.dueDate = parsedActiveFromDate;
      note.creationDate = new Date();
      note.importance = req.body.importance;
      note.completed = req.body.completed;

      await note.save(function (err) {
        if (err) {
          console.error(err);
          console.log('save error');
          res.sendStatus(500);
          return;
        }
        res.status(200).json({message: 'Note created!'});
      })
});

router.put('/note',
    async (req, res, next) => {

        const id = req.body.id;

        let note = await Note.findByIdAndUpdate(
            {'_id': id}, req.body, function (err) {
                if (err) {
                    console.error(err);
                    console.log('save error');
                    res.sendStatus(500);
                    return;
                }
                res.status(200).json({message: 'Note updated!'});
            });

    });

router.put('/note/completed',
    async (req, res, next) => {

        const id = req.body.id;

        let note = await Note.findOne({'_id': id});
        note.completed = true;

        await note.save(function (err) {
            if (err) {
                console.error(err);
                console.log('save error');
                res.sendStatus(500);
                return;
            }
            res.status(200).json({message: 'Note completed!'});
        })
    });

router.get('/note',
    async (req, res, next) => {

        const notesList = await Note.find({})
            .catch((error) => {
                    console.log(error, 'Promise error: ' + error.message);
                }
            );

        let notesDtoList = [];
        for (let note of notesList) {
            notesDtoList.push(dtoMapper.notesToDto(note));
        }
        res.status(200).json(notesDtoList);
    });

router.get('/note/:id',
    async (req, res, next) => {

        Note.findById(req.params.id, (err, note) => {
            if (err) {
                res.status(500).send(error);
            }
            res.status(200).json(dtoMapper.notesToDto(note));
        });
    });

router.delete('/note',
    async (req, res, next) => {
        const id = req.body.id;

        await Note.findByIdAndDelete(id, function (err) {
            if (err) {
                console.error(err);
                console.log('save error');
                res.sendStatus(500);
                return;
            }
            res.status(200).json({message: 'Note deleted!'});
        })
    });


module.exports = router;
