'use strict';


export const routes  = {
    home: { id: 'home'},
    allNotes: { id: 'all-notes'},
    newNote: { id: 'new-note'}
}

export class Router {

    constructor() {

    }

    select_tab(id) {
        // remove selected class from all buttons
        document.querySelectorAll(".route").forEach(item => item.classList.remove('selected'));
        // select clicked element (visually)
        document.querySelectorAll("#" + id).forEach(item => item.classList.add('selected'));
    }
    loadContent(id) {
        // Update text "Content loading for {id}..."
        // Of course, here you would do you content loading magic
        // Perhaps run Fetch API to update resources
        document.querySelector("#content").innerHTML = 'Content loading for /' + id + '...';
        $('content').load(`./pages/${id}.html`);
    }

    push(event) {
        // Get id attribute of the box or button or link clicked
        let id = event.target.id;
        // Visually select the clicked button/tab/box
       // select_tab(id);
        // Update Title in Window's Tab
        document.title = id;
        // Load content for this tab/page
        this.loadContent(id);
        // Finally push state change to the address bar
        window.history.pushState({id}, `${id}`, `/page/${id}`);
    }

}
