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
                        <div class="col-75">
                            <div class="stars">
                                    <input class="stars__checkbox" type="radio" id="star-5" name="star">
                                    <label class="stars__star" for="star-5">
                                        <svg class="stars__star-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                            viewBox="0 0 53.867 53.867" style="enable-background:new 0 0 53.867 53.867;" xml:space="preserve">
                                            <polygon points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 
                                                10.288,52.549 13.467,34.013 0,20.887 18.611,18.182 "/>
                                        </svg>
                                    </label>
                                    <input class="stars__checkbox" type="radio" id="star-4" name="star">
                                    <label class="stars__star" for="star-4">
                                        <svg class="stars__star-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                            viewBox="0 0 53.867 53.867" style="enable-background:new 0 0 53.867 53.867;" xml:space="preserve">
                                            <polygon points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 
                                                10.288,52.549 13.467,34.013 0,20.887 18.611,18.182 "/>
                                        </svg>
                                    </label>
                                    <input class="stars__checkbox" type="radio" id="star-3" name="star">
                                    <label class="stars__star" for="star-3">
                                        <svg class="stars__star-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                            viewBox="0 0 53.867 53.867" style="enable-background:new 0 0 53.867 53.867;" xml:space="preserve">
                                            <polygon points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 
                                                10.288,52.549 13.467,34.013 0,20.887 18.611,18.182 "/>
                                        </svg>
                                    </label>
                                    <input class="stars__checkbox" type="radio" id="star-2" name="star">
                                    <label class="stars__star" for="star-2">
                                        <svg class="stars__star-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                            viewBox="0 0 53.867 53.867" style="enable-background:new 0 0 53.867 53.867;" xml:space="preserve">
                                            <polygon points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 
                                                10.288,52.549 13.467,34.013 0,20.887 18.611,18.182 "/>
                                        </svg>
                                    </label>
                                    <input class="stars__checkbox" type="radio" id="star-1" name="star">
                                    <label class="stars__star" for="star-1">
                                        <svg class="stars__star-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                            viewBox="0 0 53.867 53.867" style="enable-background:new 0 0 53.867 53.867;" xml:space="preserve">
                                            <polygon points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 
                                                10.288,52.549 13.467,34.013 0,20.887 18.611,18.182 "/>
                                        </svg>
                                    </label>
                                </div>
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
        document.querySelector('#notes-form').addEventListener('submit', async(event) => {
            event.preventDefault();

            let importance = 0;
            for (let index = 1; index <= 5 ; index++) {
                if (document.getElementById('star-' + index).checked) {
                    importance = index;
                }
            }

            const submittedNote = {
                title: event.target.title.value,
                description: event.target.description.value,
                dueDate: event.target.dueDate.value,
                importance: importance,
                completed: false
            };

            if (this.idOfEditingTask !== undefined) {
                submittedNote.id = this.idOfEditingTask;
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
      this.mainContainer.innerHTML = this.singleNoteTemplate();
      this.notesForm = document.getElementById('notes-form');
    }

    async init() {
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
            $("#star-" + index).prop('checked', true);
        }
    }

    static async doBootstrap({router, notesService}) {
        await new SingleNoteController(router, notesService).init();
    }
}
