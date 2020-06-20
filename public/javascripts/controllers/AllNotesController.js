'use strict';

import { localStorageService } from '../services/localstorage-service.js';
import NotesService from '../services/notes-service.js';
import { SingleNoteController } from './SingleNoteController.js';


export default class AllNotesController {

    constructor (notesService) {
        this.template = `
            <div class="container">
                    <button id="createNote" class="menu-button create-new"><span>Create New</span></button>
                    <h3>Task List</h3>
                    <button class="sortByDate menu-button"><span>Sort by Due Date</span></button>
                    <button class="sortByCreation menu-button"><span>Sort by Creation Date</span></button>
                    <button class="byImportance menu-button"><span>Sort by Importance</span></button>
                    <button class="completedTasks menu-button" data-starttext="Show completed tasks" data-selecttext="Show open tasks" id="completeButton"><span>Show completed tasks</span></button>
                    <ul id="incomplete-tasks" class="tasks">
                        {{#if notes}}
                            {{#each notes}}
                                <li>
                                    {{#if completed }}
                                        <input type="checkbox"  data-id="{{id}}" data-action="completeNote" class="completed" checked="true">
                                    {{else}}
                                        <input type="checkbox"  data-id="{{id}}" data-action="completeNote" class="completed">
                                    {{/if}}
                                    <span>{{title}}</span>
                                    <span>{{description}}</span>
                                    <span class="star">
                                         {{#times importance}}
                                             <label></label>
                                          {{/times}}
                                    </span>
                                    <span>{{formatDate dueDate}}</span>
                                    <button data-id="{{id}}" data-action="editNote" class="edit icon-button"><label data-id="{{id}}" data-action="editNote" title="Edit {{id}}"></label></button>
                                    <button data-id="{{id}}" data-action="deleteNote" class="delete icon-button"><label data-id="{{id}}" data-action="deleteNote" title="Delete {{id}}"></label></button>
                                </li>
                            {{/each}}
                          {{else}}
                            <p>Everything is done! Enjoy your time off!</p>
                          {{/if}}
                    </ul>
              </div>`;

        this.allNotesTemplate = Handlebars.compile(this.template);
        this.mainContainer = document.querySelector("main");
        this.notesService = notesService;
        this.showCompleted = false;
    }

    initEventHandlers() {
        console.log('AllNotesController.js event handlers');

        $("#createNote").click( function () {
            console.log('clicked Neew Note');
            // add Router hash to window
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

        $("#completeButton").click(() => {

            let textToShow = '';

            let showCompletedNotes = localStorageService.getItem('showCompletedNotes');
            if (showCompletedNotes === null || showCompletedNotes === 'false') {
                console.log('checked false');
                localStorageService.setItem('showCompletedNotes', 'true');
                this.showCompleted = true;
               // this.getCompletedNotes();
                textToShow = $("#completeButton").data('selecttext');
                $("#completeButton").find('span').text(textToShow);
            } else {
                console.log('checked true');
                localStorageService.setItem('showCompletedNotes', 'false');
             //   this.getAllNotes();
                this.showCompleted = false;
                textToShow = $("#completeButton").data('starttext');
                $("#completeButton").find('span').text(textToShow);
            }
            this.renderAllNotesView();
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

    async deleteNote(noteToDelete) {
        // filter out to be deleted task from view
        this.notes = this.notes.filter((note) => note.id = noteToDelete.id);
        try {
            await this.notesService.deleteNote(noteToDelete);
        } catch (error) {
            console.log('An exception happened: ', error);
            this.notes.push(noteToDelete);
        }
        await this.renderAllNotesView();
    }

    async completeNote(completedNote) {
        // this.notes.filter((note) => note.id = completedNote.id);
        try {
            await this.notesService.completeNote(completedNote);
        } catch (error) {
            console.log('An exception happened: ', error);
            this.notes.push(completedNote);
        }
        await this.renderAllNotesView();
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
        this.renderAllNotesView();
    }

    // rendering & navigation
    navigateToSingleNote(id) {
        window.location.hash = '#new?id=' + id;
        console.log('go to singleController');
        // this.router.navigate(
        // routing to singleNoteController
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
        console.log('init method called')
        console.log('notes are: ', this.notes);
        await this.renderAllNotesView();
    }

    static async doBootstrap() {
        await new AllNotesController(new NotesService('/api/note')).init();
    }

}
