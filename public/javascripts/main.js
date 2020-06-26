'use strict';

import '/jquery.min.js';
import AllNotesController from './controllers/all-notes-controller.js';
import ErrorController from './controllers/error-controller.js';
import { SingleNoteController } from './controllers/single-note-controller.js';
import * as Router from './router/router.js';
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

document.addEventListener('DOMContentLoaded', (event) => {
        const currentRoute = Router.evaluteCurrentHashLocation();
        const existingRoute = Object.keys(routes).filter((key) => key === currentRoute);

        if (existingRoute !== undefined && !$.isEmptyObject(existingRoute)) {
            routes[existingRoute].doBootstrap(allServices);
        } else {
            AllNotesController.doBootstrap(allServices);
        }
});

window.addEventListener("hashchange", (event) => {

    if (event.newURL.includes('#new')) {
        routes['new'].doBootstrap(allServices);
    } else if (event.newURL.includes('#all')) {
        routes['all'].doBootstrap(allServices);
    } else if (event.newURL.endsWith('#')) {
        // do nothing -- theme change
    }
    else {
        routes['error'].doBootstrap(allServices);
    }
});



