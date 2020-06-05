import NotesService from '../services/notes-service.js';


export class SingleNoteController {

    constructor (notesService) {
        this.template = `
            <div class="container">
                <form id="notes-form" action="/">
                    <div class="row">
                        <div class="col-25">
                            <label for="title">Titel</label>
                        </div>
                        <div class="col-75">
                            <input type="text" id="title" name="title" placeholder="Your name..">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="description">Beschreibung:</label>
                        </div>
                        <div class="col-75">
                            <textarea id="description" name="description" placeholder="Write something.." style="height:200px"></textarea>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="dueDate">Due date:</label>
                        </div>
                        <div class="col-75">
                            <input type="date" id="dueDate" name="dueDate">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-25">
                            <label for="importance">Wichtigkeit</label>
                        </div>
                        <div class="col-75 rating">
                            <input type="radio" id="star5" name="rating" value="5" /><label for="star5"></label>
                            <input type="radio" id="star4" name="rating" value="4" /><label for="star4"></label>
                            <input type="radio" id="star3" name="rating" value="3" /><label for="star3"></label>
                            <input type="radio" id="star2" name="rating" value="2" /><label for="star2"></label>
                            <input type="radio" id="star1" name="rating" value="1" /><label for="star1"></label>                       
                        </div>
                    </div>
                    <div class="row">
                        <input type="submit" value="Submit">
                    </div>
                </form>
            </div>`;

        this.singleNoteTemplate = Handlebars.compile(this.template);
        this.mainContainer = document.querySelector("main");
        this.notesService = notesService;
    }

    initEventHandlers() {
        console.log('here are the event handlers');

        document.querySelector('#notes-form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const submittedNote = {
                title: event.target.title.value,
                description: event.target.description.value,
                dueDate: event.target.dueDate.value,
                importance: 4,
                completed: false
            };

/*            if (isUpdateOfNote) {
                submittedNote.id = id;
                importance: event.target.importance.value,
                await this.notesService.updateNote(submittedNote)
            } else { keis update}
            */
           await this.notesService.createNote(submittedNote);
           // return to AllListController --> navigate with router
           await this.renderSingleNoteView();

        })
    }

    async renderSingleNoteView() {
       // this.allNotes = this.notes;
      this.mainContainer.innerHTML = this.singleNoteTemplate();
      this.notesForm = document.getElementById('notes-form');
      this.initEventHandlers();
    }

    async init() {
      //  this.notes = await this.notesService.getAllNotes();
        console.log('init method called')

        await this.renderSingleNoteView();

        // check if the call is for an edit task or not
       // const id = // get from router or call
       // this.notesService.getNoteById(id);
        // this.injectNoteIntoForm(note);
    }

    injectNoteIntoForm(note) {
        this.notesForm.title = note.title;
        this.notesForm.description = note.description;
        this.notesForm.importance = note.importance;
        this.notesForm.dueDate = note.dueDate;
    }

    static async doBootstrap() {
        await new SingleNoteController(new NotesService('/api/note')).init();
    }
}
