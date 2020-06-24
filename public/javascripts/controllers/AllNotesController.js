'use strict';
import { localStorageService } from '../services/localstorage-service.js';

export default class AllNotesController {

    constructor (router, notesService) {
        this.template = `
            <div class="container">
                    <button id="createNote" class="menu-button create-new"><span>Create New</span></button>
                    <h3>Task List</h3>
                    <div class="button-container">
                    <button class="sortByDate menu-button"><span>Sort by Due Date</span></button>
                    <button class="sortByCreation menu-button"><span>Sort by Creation Date</span></button>
                    <button class="byImportance menu-button"><span>Sort by Importance</span></button>
                    {{#if showCompleted }}
                        <button class="completedTasks menu-button" id="completeButton"><span>Show just open tasks</span></button>
                    {{else}}
                        <button class="completedTasks menu-button" id="completeButton"><span>Show completed tasks</span></button>
                    {{/if}}
                    </div>
                    <div id="incomplete-tasks" class="task-list">
                        {{#if notes}}
                            {{#each notes}}
                            <div class="tasks">
                                    <div class="note-todo">
                                        {{#if completed }}
                                            <input type="checkbox"  data-id="{{id}}" data-action="notCompleted" class="completed" checked="true">
                                        {{else}}
                                            <input type="checkbox"  data-id="{{id}}" data-action="completeNote" class="completed">
                                        {{/if}}
                                    </div>
                                    <div class="note-title">{{title}}</div>
                                    <div class="note-description">{{description}}</div>
                                    <div class="note-importance">
                                        <span class="star">
                                             {{#times importance}}
                                                 <label></label>
                                              {{/times}}
                                        </span>                              
                                    </div>
                                    <div class="note-duedate">{{formatDate dueDate}}</div>
                                    <div class="action-items">
                                        {{#unless completed }}
                                            <button data-id="{{id}}" data-action="editNote" class="edit icon-button"><label data-id="{{id}}" data-action="editNote" title="Edit {{id}}"></label></button>
                                        {{/unless}}
                                        <button data-id="{{id}}" data-action="deleteNote" class="delete icon-button"><label data-id="{{id}}" data-action="deleteNote" title="Delete {{id}}"></label></button>
                                    </div>
                                </div>
                            {{/each}}
                          {{else}}
                            <p>Everything is done! Enjoy your time off!</p>
                          {{/if}}
                    </div>
              </div>`;

        this.allNotesTemplate = Handlebars.compile(this.template);
        this.mainContainer = document.querySelector("main");
        this.notesService = notesService;
        this.router = router;
        this.showCompleted = false;
    }

    initEventHandlers() {
        document.querySelector(".create-new").addEventListener('click', () => {
            // add Router hash to window
            this.navigateToSingleNote();
        });

       document.querySelector(".task-list")
                .addEventListener('click', (event) => {
           let {id, action} = event.target.dataset;

           const affectedNote = this.notes.find((note) => note.id === id);

           switch (action) {
               case 'deleteNote':
                   this.deleteNote(affectedNote);
                   break;
               case 'editNote':
                   this.navigateToSingleNote(id);
                   break;
               case 'completeNote':
                   this.completeNote(affectedNote);
                   break;
               case 'notCompleted':
                   affectedNote.completed = false;
                   this.updateNote(affectedNote);
               default:
                   console.log('action not matched or error');
                   break;
           }
       });

        $("#completeButton").click(() => {
            let showCompletedNotes = localStorageService.getItem('showCompletedNotes');
            if (showCompletedNotes === null || showCompletedNotes === 'false') {
                console.log('checked false');
                localStorageService.setItem('showCompletedNotes', 'true');
                this.showCompleted = true;
            } else {
                console.log('checked true');
                localStorageService.setItem('showCompletedNotes', 'false');
                this.showCompleted = false;
            }
            this.renderAllNotesView();
        });

       document.querySelector('.sortByDate').addEventListener('click', (event) => {
           this.sortNotesByDueDate();
       });
       document.querySelector('.byImportance').addEventListener('click', (event) => {
           this.sortByImportance();
       });
       document.querySelector('.sortByCreation').addEventListener('click', (event) => {
           this.sortNotesByCreationDate();
       });

    }

    async deleteNote(noteToDelete) {
        // filter out to be deleted task from view
        this.notes = this.notes.filter((note) => note.id !== noteToDelete.id);
        console.log('Notes after it has been filtered: ', this.notes);
        try {
            await this.notesService.deleteNote(noteToDelete);
        } catch (error) {
            console.log('An exception happened: ', error);
            this.notes.push(noteToDelete);
        }
        await this.renderAllNotesView();
    }

    async completeNote(completedNote) {
        try {
            await this.notesService.completeNote(completedNote);
        } catch (error) {
            console.log('An exception happened: ', error);
        }
        await this.renderAllNotesView();
    }

    async updateNote (affectedNote) {
        try {
            await this.notesService.updateNote(affectedNote);
        } catch (error) {
            console.log('An exception happened: ', error);
        }
        await this.getAllNotes();
       // await this.renderAllNotesView();
    }

    async getCompletedNotes() {
        this.notes = await this.notesService.getCompletedNotes();
        await this.renderAllNotesView();
    }

    async getAllNotes() {
        this.notes = await this.notesService.getAllNotes();
        await this.renderAllNotesView();
    }

    async sortNotesByDueDate() {
        this.notes.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        console.log(this.notes);
        this.renderAllNotesView();
    }

    async sortByImportance() {
        this.notes.sort((a, b) => b.importance - a.importance);
        this.renderAllNotesView();
    }

    async sortNotesByCreationDate() {
        this.notes.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
        // sort ascending and descending TODO
        this.renderAllNotesView();
    }

    // rendering & navigation
    navigateToSingleNote(id) {
        window.location.hash = id ? '#new?id=' + id : '#new';
    }
    async renderAllNotesView() {
        this.allNotes = this.notes.filter((note) => this.showCompleted || !note.completed);
        this.mainContainer.innerHTML = this.allNotesTemplate({
            notes: this.allNotes,
            showCompleted: this.showCompleted
        })
        this.initEventHandlers();
    }

    async init() {
        await this.getAllNotes();
        await this.renderAllNotesView();
    }

    static async doBootstrap({router, notesService}) {
        await new AllNotesController(router, notesService).init();
    }
}
