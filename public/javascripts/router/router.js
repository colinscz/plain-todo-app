'use strict';

    export function navigate(path) {
        window.location.hash = '#' + path;
    }

    export function evaluteCurrentHashLocation() {
        return window.location.hash.slice(1).split(':')[0];
    }

    export function evaluatePage() {

    }


