import NotesService from '../services/notes-service.js';


export default class AllNotesController {

    constructor (notesService) {
        this.template = `
            <div class="container">
                    <h3>Todo</h3>
                    <ul id="incomplete-tasks">
                        {{#if notes}}
                            {{#each notes}}
                            <li>
                                <input type="checkbox" checked="">
                                <span>{{title}}</span>
                                <span>{{description}}</span>
                                <span>{{importance}}</span>
                                <span>{{dueDate}}</span>
                                <button class="edit">Edit</button>
                                <button class="delete">Delete</button>
                            </li>
                            {{/each}}
                          {{else}}
                            <p>
                                Everything is done! Enjoy your time off!
                            </p>
                          {{/if}}
                    </ul>
              </div>`;

        this.allNotesTemplate = Handlebars.compile(this.template);
        this.mainContainer = document.querySelector("main");
        this.notesService = notesService;

    }

    initEventHandlers() {
        console.log('here are the event handlers');
    }

    async renderAllNotesView() {
        this.initEventHandlers();
        this.allNotes = this.notes;
        this.mainContainer.innerHTML = this.allNotesTemplate({
            notes: this.allNotes
        })
    }

    async init() {
        this.notes = await this.notesService.getAllNotes();
        console.log('init method called')
        console.log('notes are: ', this.notes);
        await this.renderAllNotesView();
    }

/*    async sortNotes(notes) {
        return [...notes].sort(compareNotes)
    }

    async compareNotes(n1, n2) {
        return n2.importance - n1.importance;
    }*/

    static async doBootstrap() {
        await new AllNotesController(new NotesService('/api/note')).init();
    }

}
