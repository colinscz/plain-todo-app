'use strict';

import NotesService from '../services/notes-service.js';

export class SingleNoteController {

    constructor (notesService) {
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
                            <input type="date" id="dueDate" name="dueDate" required>
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
        this.idOfEditingTask = null;
        console.log('notesform: ', this.notesForm);
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

            console.log('idTask value: ', this.idOfEditingTask);
            if (this.idOfEditingTask !== undefined) {
                // importance: event.target.importance.value,
                submittedNote.id = this.idOfEditingTask;
                console.log('update existing note is triggered');
                await this.notesService.updateNote(submittedNote);
            } else {
                await this.notesService.createNote(submittedNote);
            }

           // return to AllListController --> navigate with router
      //     await this.renderSingleNoteView();

        })
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

        console.log('id of task to edit: ', this.idOfEditingTask);
        console.log('Not undefined id: ', this.idOfEditingTask !== undefined);

        if (this.idOfEditingTask !== undefined) {
            console.log('id of task to edit: ', this.idOfEditingTask);
            let editNote = await this.notesService.getNoteById(this.idOfEditingTask);
            console.log('editNote: ', editNote);
            this.injectNoteIntoForm(editNote);
        }

        this.initEventHandlers();

    }

    injectNoteIntoForm(note) {
        console.log('injectForm triggered');
        this.notesForm.title.value = note.title;
        this.notesForm.description.value = note.description;
        this.notesForm.dueDate.value = note.dueDate;
        // this.notesForm.importance.value = note.importance;
        for (let index = 0; index < note.importance; index++) {
            document.getElementById('star' + index).click();
        }
    }

    static async doBootstrap() {
        await new SingleNoteController(new NotesService('/api/note')).init();
    }
}
