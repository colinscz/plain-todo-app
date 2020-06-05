export default class NotesService {

    constructor (url) {
        this.url = url;
        this.completedUrl = this.url + '/completed';
    }

    async getNoteById(id) {
        return fetch(this.url + `/${id}` )
    }

    async getAllNotes() {
        console.log('has been triggered');
        return fetch(this.url).then(response => response.json());
    }

    async getCompletedNotes() {
        return fetch(this.completedUrl).then(response => response.json());
    }

    async completeNote(note) {
        return fetch(this.completedUrl, {
            method: 'PUT',
            body: JSON.stringify(note),
            headers:{
                'Content-Type': 'application/json'
            }
        });
    }

    async createNote(note) {
        console.log('triggered: ', note);
        return fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(note),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(response => response.json());
    }

    async updateNote(note) {
        return fetch(this.url, {
            method: 'PUT',
            body: JSON.stringify(note),
            headers:{
                'Content-Type': 'application/json'
            }
        });
    }

    async deleteNote(note) {
        return fetch(this.url, {
            method: 'DELETE',
            body: JSON.stringify(note),
            headers:{
                'Content-Type': 'application/json'
            }
        });
    }



}
