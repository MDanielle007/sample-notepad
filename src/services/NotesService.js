import db from './DatabaseService';

export const NotesService = {
    async getAllNotes() {
        try {
            const notes = await db.notes.toArray();

            return notes;
        } catch (error) {
            console.error('Error getting notes:', error);
            return [];
        }
    },

    async insertNote(note){
        try {
            const res = await db.notes.add({
                title: note.title,
                description: note.description
            });

            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error);
        }
    },

    async updateNote(id, note){
        try {
            const res = await db.notes.update(id,{
                title: note.title,
                description: note.description
            });

            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error);
        }
    },

    async deleteNote(id){
        try {
            await db.notes.delete(id);

            return Promise.resolve(true);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}