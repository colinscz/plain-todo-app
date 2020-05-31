'use strict';

// import notesService from './services/notes-service.js';


import '/jquery.min.js';
import AllNotesController from './controllers/AllNotesController.js';
import ErrorController from './controllers/ErrorController.js';
import { SingleNoteController } from './controllers/SingleNoteController.js';

window.$ = jQuery;

document.addEventListener('DOMContentLoaded', AllNotesController.doBootstrap);

$("#newNote").click( function () {
    SingleNoteController.doBootstrap();
 //   $("main").load("pages/new-note.html");
});

$("#allNotes").click( function () {
    AllNotesController.doBootstrap();
});

const routes = {
    allNotes: AllNotesController,
    newNote: SingleNoteController,
    error: ErrorController
};

// new router(routes);

// DOM Elements



