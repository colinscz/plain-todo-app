import * as router from './router.js';

window.onload = event => {
    // Add history push() event when boxes are clicked
    window["home"].addEventListener("click", event => router.push(event))
    window["new-note"].addEventListener("click", event => router.push(event))
    window["all-notes"].addEventListener("click", event => router.push(event))
}
