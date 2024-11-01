import Dexie from 'dexie';

const db = new Dexie('myNotepadDB');
db.version(1).stores({
  notes: '++id, title, description', // Primary key and indexed props
});

export default db;