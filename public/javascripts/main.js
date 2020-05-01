import * as router from './router.js';

export class ApplicationMain {

    constructor () {
        this.initializeNavigationEventListeners();
    }

    initializeNavigationEventListeners = () => {
        console.log('test initialization');
        // Add history push() event when boxes are clicked
        $('#home').addEventListener("click", event => router.push(event))
        $('#new-note').addEventListener("click", event => router.push(event))
        $('#all-notes').addEventListener("click", event => router.push(event))
    }

}
