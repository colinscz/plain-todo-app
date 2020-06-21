const dtoMapper = require('../dto/dtoMapper');
const Note = require('../models/notes');

class NoteStore {

    async add(req) {
        console.log('test: ', req.body);
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
    }

    async delete(req) {
        console.log('id body: ', req.body.id);
        const id = req.body.id;

        await Note.findByIdAndDelete(id, function (err) {
            if (err) {
                console.error(err);
                console.log('save error');
                res.sendStatus(500);
                return;
            }
            res.status(200).json({message: 'Note deleted!'});
        });
        return await this.get(id);
    }

    async update(req) {
        const id = req.body.id;

        console.log('body: ', req.body);

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
    }

    async get(id) {
        console.log('id: ' , req.params.id)

        await Note.findById(req.params.id, (err, note) => {
            if (err) {
                res.status(500).send(error);
            }
            return dtoMapper.notesToDto(note);
        });
    }

    async completedNotes(req) {

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
    }

    async all() {
        const notesList = await Note.find({'completed': false})
            .catch((error) => {
                    console.log(error, 'Promise error: ' + error.message);
                }
            );

        let notesDtoList = [];
        for (let note of notesList) {
            notesDtoList.push(dtoMapper.notesToDto(note));
        }
        return notesDtoList;
    }
}

module.exports = new NoteStore();
