'use strict';

import router from "./router";
import Route from "./router/Route";

import homeView from "./pages/home";
import allNotesView from "./pages/all-notes";
import newNoteView from "./pages/new-note";
import errorView from "./pages/error-page";

import "./style.css";

const routes = [
    new Route("home", "/", homeView),
    new Route("all-notes", "/all-notes", allNotesView),
    new Route("new-note", "/new-note", newNoteView),
    new Route("error", "/error", errorView),
];

router(routes);

export let changeStyle = () => {
    const element = document.body;
    element.classList.toggle("dark-mode");
}


