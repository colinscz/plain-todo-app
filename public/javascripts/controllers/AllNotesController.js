'use strict';

import NotesService from '../services/notes-service.js';
import { SingleNoteController } from './SingleNoteController.js';


export default class AllNotesController {

    constructor (notesService) {
        this.template = `
            <div class="container">
                    <button id="createNote" class="right-aligned button-two"><span>Create New</span></button>
                    <h3>Task List</h3>
                    <button class="sortByDate button-two"><span>Sort by Due Date</span></button>
                    <button class="sortByCreation button-two"><span>Sort by Creation Date</span></button>
                    <button class="byImportance button-two"><span>Sort by Importance</span></button>
                    <button class="completedTasks button-two"><span>Show completed tasks</span></button>
                    <ul id="incomplete-tasks" class="tasks">
                        {{#if notes}}
                            {{#each notes}}
                            <li>
                                <!--checked="{{completed}}"-->
                                <input type="checkbox"  data-id="{{id}}" data-action="completeNote" class="completed">
                                <span>{{title}}</span>
                                <span>{{description}}</span>
                  
                                <span>
                                     <fieldset class="fixed-rating">
                                     {{#times importance}}
                                        <input type="radio" id="star{{this}}" name="rating" value="{{this}}" /><label class= "full" for="star{{this}}" title="Awesome - {{this}} stars"></label>
                                      {{/times}}
                                     </fieldset>
                                </span>
                                <span>{{formatDate dueDate}}</span>
                                <button data-id="{{id}}" data-action="editNote" class="edit icon-button"><label data-id="{{id}}" data-action="editNote" title="Edit {{id}}"></label></button>
                                <button data-id="{{id}}" data-action="deleteNote" class="delete icon-button"><label data-id="{{id}}" data-action="deleteNote" title="Delete {{id}}"></label></button>
                            </li>
                            {{/each}}
                          {{else}}
                            <p>
                                Everything is done! Enjoy your time off!
                            </p>
                          {{/if}}
                    </ul>
              </div>`;

        Handlebars.registerHelper('times', function(n, block) {
            var accum = '';
            for(var i = 0; i < n; ++i)
                accum += block.fn(i);
            return accum;
        });

        this.allNotesTemplate = Handlebars.compile(this.template);
        this.mainContainer = document.querySelector("main");
        this.notesService = notesService;

    }

    initEventHandlers() {
        console.log('AllNotesController.js event handlers');

        $("#createNote").click( function () {
            console.log('clicked Neew Note');
            SingleNoteController.doBootstrap();
        });

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
            $("#completedTasks").click(function () {
                localStorage.setItem('showCompletedNotes','false');
                localStorage.setItem('showCompletedNotes','true');
            });
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
        // filter out to be deleted task from view
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
        window.location.hash = '#new?id=' + id;
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
