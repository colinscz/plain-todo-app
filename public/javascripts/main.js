'use strict';

import '/jquery.min.js';
import AllNotesController from './controllers/AllNotesController.js';
import ErrorController from './controllers/ErrorController.js';
import { SingleNoteController } from './controllers/SingleNoteController.js';
import * as Router from './router/Router.js';
import NotesService from './services/notes-service.js';
import ErrorService from './services/error-service.js';

window.$ = jQuery;

const noteApiUrl = '/api/note';

const routes = {
    all: AllNotesController,
    new: SingleNoteController,
    error: ErrorController
};

const allServices = {
    notesService: new NotesService(noteApiUrl),
    errorService: new ErrorService(),
    router: Router,
}

$("#newNote").click( function () {
    SingleNoteController.doBootstrap(allServices);
});

$("#allNotes").click( function () {
    AllNotesController.doBootstrap(allServices);
});

document.addEventListener('DOMContentLoaded', AllNotesController.doBootstrap(allServices));

window.addEventListener("hashchange", (event) => {

   // Router.navigate(event.newURL);
    console.log('Aktueller Hash', location.hash);
    console.log('Neuer Hash', event.newURL);
    console.log('Jetziger Hash', event.oldURL);

    if (event.newURL.includes('#new')) {
        SingleNoteController.doBootstrap(allServices);
    } else if (event.newURL.includes('#all')) {
        routes['all'].doBootstrap(allServices);
    } else if (event.newURL.endsWith('#')) {
        // do nothing -- theme change
    }
    else {
        routes['error'].doBootstrap(allServices);
    }
});



