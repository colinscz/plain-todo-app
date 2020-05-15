'use strict';

import '/jquery.min.js';
import router from "./router/Router.js";
import Route from "./router/Route.js";

window.$ = jQuery;


$("#new-note").click( function () {
    $("main").load("pages/new-note.html");
});

$("#home").click( function () {
    $.load("index.html");
});

$("#all-notes").click( function () {
    $("main").load("pages/all-notes.html");
});

const routes = [
    new Route("all-notes", "/all-notes", 'all-notes'),
    new Route("new-note", "/new-note", 'new-note'),
    new Route("error", "/error", 'error-page'),
];

new router(routes);

// DOM Elements



