import NotesService from '../services/notes-service.js';


export default class AllNotesController {

    constructor (notesService) {
        this.template = `
            <div class="container">
                    <h3>Todo</h3>
                    <button>Sort by Due Date</button>
                    <button>Sort by Creation Date</button>
                    <button>Sort by Importance</button>
                    <button></button>
                    <ul id="incomplete-tasks" class="tasks">
                        {{#if notes}}
                            {{#each notes}}
                            <li>
                                <!--checked="{{completed}}"-->
                                <input type="checkbox"  data-id="{{id}}" data-action="completeNote" class="completed">
                                <span>{{title}}</span>
                                <span>{{description}}</span>
                                <span>{{importance}}</span>
                                <span>{{dueDate}}</span>
                                <button data-id="{{id}}" data-action="editNote" class="edit">Edit</button>
                                <button data-id="{{id}}" data-action="deleteNote" class="delete">Delete</button>
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
        console.log('here are the AllNotesController.js event handlers');


       // let completeAction = document.querySelectorAll(".completed");
       document.querySelector(".tasks").addEventListener('click', (event) => {
           let {id, action} = event.target.dataset;
           console.log('id: ', id);
           console.log('action: ', action);

           const affectedNote = this.notes.find((note) => note.id === id);

           switch (action) {
               case 'deleteNote':
                   console.log('deleteNote Id: ', id);
                   this.deleteNote(affectedNote);
                   break;
               case 'editNote':
                   console.log('go to singleController');
                   break;
               case 'completeNote':
                   this.completeNote(affectedNote);
                   break;
               default:
                   console.log('action not matched or error');
                   break;
           }
       });


    }

    removeEventHandlers() {
       // document.querySelector(".tasks").removeEventListener('click');
    }

    async renderAllNotesView() {
        this.allNotes = this.notes;
        this.mainContainer.innerHTML = this.allNotesTemplate({
            notes: this.allNotes
        })
        this.initEventHandlers();
    }

    async init() {
        this.notes = await this.notesService.getAllNotes();
        console.log('init method called')
        console.log('notes are: ', this.notes);
        await this.renderAllNotesView();
    }

    async deleteNote(note) {
        await this.notesService.deleteNote(note);
        await this.renderAllNotesView();
    }

    async completeNote(note) {
        await this.notesService.completeNote(note);
        await this.renderAllNotesView();
    }

/*    async sortNotes(notes) {
        return [...notes].sort(compareNotes)
    }

    async compareNotes(n1, n2) {
        return n2.importance - n1.importance;
    }

    async compareDates(n1, n2) {

    }
*/
    static async doBootstrap() {
        await new AllNotesController(new NotesService('/api/note')).init();
    }

}
