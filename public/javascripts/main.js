'use strict';

import '/jquery.min.js';
import router from "./router/Router.js";
import Route from "./router/Route.js";

/*
import homeView from "./pages/home";
import allNotesView from "./pages/all-notes.html";
import newNoteView from "./pages/new-note";
import errorView from "./pages/error-page";
*/

window.$ = jQuery;

const routes = [
    new Route("home", "/", 'index'),
    new Route("all-notes", "/all-notes", 'all-notes'),
    new Route("new-note", "/new-note", 'new-note'),
    new Route("error", "/error", 'error-page'),
];

router(routes);

// DOM Elements



