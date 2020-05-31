export default class NotesService {

    constructor (url) {
        this.url = url;
    }

    async getNoteById(id) {
        return fetch(this.url + '/${id}' )
    }

    async getAllNotes() {
        console.log('has been triggered');
        return fetch(this.url).then(response => response.json());
    }

    async getCompletedNotes() {
        return fetch(this.url + '/completed' ).then(response => response.json());
    }

    async createNote(note) {
        // retun post(this.url, note);
    }

    async updateNote(note) {
        // return put(this.url, note);
    }


}
