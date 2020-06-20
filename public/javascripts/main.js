'use strict';

import '/jquery.min.js';
import AllNotesController from './controllers/AllNotesController.js';
import ErrorController from './controllers/ErrorController.js';
import { SingleNoteController } from './controllers/SingleNoteController.js';

window.$ = jQuery;

document.addEventListener('DOMContentLoaded', AllNotesController.doBootstrap);

$("#newNote").click( function () {
    SingleNoteController.doBootstrap();
});

$("#allNotes").click( function () {
    AllNotesController.doBootstrap();
});

const routes = {
    allNotes: AllNotesController,
    newNote: SingleNoteController,
    error: ErrorController
};

window.addEventListener("hashchange", (event) => {
    console.log('Aktueller Hash', location.hash);
    console.log('Neuer Hash', event.newURL);
    console.log('Jetziger Hash', event.oldURL);

    if (event.newURL.includes('#new')) {
        SingleNoteController.doBootstrap();
    }
    if (event.newURL.includes('#all')) {
        AllNotesController.doBootstrap();
    }
});

// new router(routes);

// DOM Elements



