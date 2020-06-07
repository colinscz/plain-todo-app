import NotesService from '../services/notes-service.js';


export default class AllNotesController {

    constructor (notesService) {
        this.template = `
            <div class="container">
                    <h3>Todo</h3>
                    <button class="sortByDate">Sort by Due Date</button>
                    <button class="sortByCreation">Sort by Creation Date</button>
                    <button class="byImportance">Sort by Importance</button>
                    <button class="completedTasks">Show completed tasks</button>
                    <button>Create New</button>
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
        console.log('AllNotesController.js event handlers');

       // let completeAction = document.querySelectorAll(".completed");
       document.querySelector(".tasks")
                .addEventListener('click', (event) => {
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
                   this.navigateToSingleNote(id);
                   break;
               case 'completeNote':
                   this.completeNote(affectedNote);
                   break;
               default:
                   console.log('action not matched or error');
                   break;
           }
       });

       document.querySelector('.completedTasks')
                .addEventListener('click', (event) => {
                    // needs to be deselectable!
            this.getCompletedNotes();
       });

       document.querySelector('.sortByDate').addEventListener(
           'click', (event) => {
               this.sortNotesByDueDate();
           }
       );

        document.querySelector('.byImportance').addEventListener(
            'click', (event) => {
                this.sortByImportance();
            }
        );

        document.querySelector('.sortByCreation').addEventListener(
            'click', (event) => {
                this.sortNotesByCreationDate();
            }
        );

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

    async getCompletedNotes() {
        this.notes = await this.notesService.getCompletedNotes();
        await this.renderAllNotesView();
    }

    navigateToSingleNote(id) {
        console.log('go to singleController');
        // this.router.navigate(
        // routing to singleNoteController
    }

    async sortNotesByDueDate() {
        this.notes.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        console.log(this.notes);
        this.renderAllNotesView();
    }

    async sortByImportance() {
        this.notes.sort((a, b) => b.importance - a.importance);
        console.log(this.notes);
        this.renderAllNotesView();
    }

    async sortNotesByCreationDate() {
        this.notes.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
        console.log(this.notes);
        this.renderAllNotesView();
    }

    static async doBootstrap() {
        await new AllNotesController(new NotesService('/api/note')).init();
    }

}
