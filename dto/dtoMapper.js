
let notesToDto = function (note) {

    let notesDto = {
        id: note._id,
        title: note.title,
        description: note.description,
        dueDate: note.dueDate.toISOString().slice(0, -1),
        importance: note.importance,
        completed: note.completed,
    };

    return notesDto;
};

module.exports = {
    notesToDto: notesToDto,

};
