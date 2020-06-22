'use strict';
export class SingleNoteController {

    constructor (router, notesService) {
        this.template = `
            <div class="container">
                <form id="notes-form">
                    <div class="row">
                        <div class="col-25">
                            <label for="title">Titel</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="title" name="title" required placeholder="Your task title..">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="description">Beschreibung:</label>
                        </div>
                        <div class="col-75">
                            <textarea id="description" name="description" required placeholder="Write something.."></textarea>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="dueDate">Due date:</label>
                        </div>
                        <div class="col-75">
                            <input type="datetime-local" id="dueDate" name="dueDate" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="importance">Wichtigkeit</label>
                        </div>
                        <div class="col-75 rating">
<!--                        https://codepen.io/ishitaa-ashley/pen/OYWBza-->
                            <input type="radio" id="star1" name="rating" value="1" /><label class = "full" for="star1" title="Sucks big time - 1 star"></label>                     
                            <input type="radio" id="star2" name="rating" value="2" /><label class = "full" for="star2" title="Kinda bad - 2 stars"></label>
                            <input type="radio" id="star3" name="rating" value="3" /><label class = "full" for="star3" title="Meh - 3 stars"></label>
                            <input type="radio" id="star4" name="rating" value="4" /><label class = "full" for="star4" title="Pretty good - 4 stars"></label>
                            <input type="radio" id="star5" name="rating" value="5" /><label class = "full" for="star5" title="Awesome - 5 stars"></label>
                        </div>
                    </div>
                    <div class="row">
                        <input type="submit" value="Submit">
                    </div>
                </form>
            </div>`;

        this.singleNoteTemplate = Handlebars.compile(this.template);
        this.mainContainer = document.querySelector("main");
        this.idOfEditingTask = null;
        this.notesService = notesService;
        this.router =  router;
    }

    initEventHandlers() {
        console.log('here are the event handlers');

        document.querySelector('#notes-form').addEventListener('submit', async(event) => {
            event.preventDefault();

            let importance = 0;
            for (let index = 1; index <= 5 ; index++) {
                if (document.getElementById('star' + index).checked) {
                    importance = index;
                }
/*                if (document.getElementById('star5').checked == false) {
                   importance = 1;
                   break;
                }*/
            }

            const submittedNote = {
                title: event.target.title.value,
                description: event.target.description.value,
                dueDate: event.target.dueDate.value,
                importance: importance,
                completed: false
            };

            if (this.idOfEditingTask !== undefined) {
                // importance: event.target.importance.value,
                submittedNote.id = this.idOfEditingTask;
                console.log('update existing note is triggered');
                await this.notesService.updateNote(submittedNote);
            } else {
                await this.notesService.createNote(submittedNote);
            }

            // return to allNotes screen
            // router navigate to home
            window.location.hash = '#all';
        });
    }

    async renderSingleNoteView() {
       // this.allNotes = this.notes;
      this.mainContainer.innerHTML = this.singleNoteTemplate();
      this.notesForm = document.getElementById('notes-form');
    }

    async init() {
        console.log('init method called')
        await this.renderSingleNoteView();
        // check if the call is for an edit task or not
        this.idOfEditingTask = window.location.hash.slice().split('=')[1];

        if (this.idOfEditingTask !== undefined) {
            let editNote = await this.notesService.getNoteById(this.idOfEditingTask);
            this.injectNoteIntoForm(editNote);
        }

        this.initEventHandlers();
    }

    injectNoteIntoForm(note) {
        this.notesForm.title.value = note.title;
        this.notesForm.description.value = note.description;
        this.notesForm.dueDate.value = note.dueDate;
        for (let index = 1; index <= note.importance; index++) {
            document.getElementById('star' + index).click();
        }
    }

    static async doBootstrap({router, notesService}) {
        await new SingleNoteController(router, notesService).init();
    }
}
