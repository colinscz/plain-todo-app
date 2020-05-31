import NotesService from '../services/notes-service.js';


export class SingleNoteController {

    constructor (notesService) {
        this.template = `
            <div class="container">
        <form action="/">
            <div class="row">
                <div class="col-25">
                    <label for="fname">Titel</label>
                </div>
                <div class="col-75">
                    <input type="text" id="fname" name="firstname" placeholder="Your name..">
                </div>
            </div>
            <div class="row">
                <div class="col-25">
                    <label for="subject">Beschreibung:</label>
                </div>
                <div class="col-75">
                    <textarea id="subject" name="subject" placeholder="Write something.." style="height:200px"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-25">
                    <label for="due-date">Due date:</label>
                </div>
                <div class="col-75">
                    <input type="date" id="due-date" name="due-date">
                </div>
            </div>
            <div class="row">
                <div class="col-25">
                    <label for="importance">Wichtigkeit</label>
                </div>
                <div class="col-75 rating">
                        <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
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
    }

    async renderSingleNoteView() {
       // this.allNotes = this.notes;
      this.mainContainer.innerHTML = this.singleNoteTemplate({
        });
        this.initEventHandlers();
    }

    async init() {
      //  this.notes = await this.notesService.getAllNotes();
        console.log('init method called')
        await this.renderSingleNoteView();
    }

    /*    async sortNotes(notes) {
            return [...notes].sort(compareNotes)
        }

        async compareNotes(n1, n2) {
            return n2.importance - n1.importance;
        }*/

    static async doBootstrap() {
        await new SingleNoteController(new NotesService('/api/note')).init();
    }
}
