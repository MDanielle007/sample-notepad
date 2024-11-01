<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <div class="flex w-screen h-screen surface-900 justify-content-center">
        <div class="w-full sm:w-30rem surface-200">
            <!-- top bar -->
            <div
                class="h-5rem bg-indigo-900 flex justify-content-between align-items-center p-3"
            >
                <div class="text-2xl font-bold text-white">Simple Notepad</div>

                <Button
                    label="Add"
                    icon="pi pi-plus"
                    @click="addNewNotesDialog = true"
                />
            </div>

            <!-- note list -->
            <div
                class="p-3 overflow-y-auto flex flex-column gap-3"
                style="height: 40rem"
            >
                <div v-for="note in notes">
                    <Card>
                        <template #title>{{ note.title }}</template>
                        <template #content>
                            <p class="m-0">
                                {{ note.description }}
                            </p>
                        </template>
                        <template #footer>
                            <div class="flex justify-content-end gap-2">
                                <Button
                                    severity="info"
                                    outlined
                                    icon="pi pi-pencil"
                                    @click="selectNoteToEdit(note.id)"
                                />
                                <Button
                                    outlined
                                    severity="danger"
                                    icon="pi pi-trash"
                                    @click="deleteNote(note.id)"
                                />
                            </div>
                        </template>
                    </Card>
                </div>
            </div>

            <!-- add note form dialog -->

            <Dialog
                v-model:visible="addNewNotesDialog"
                modal
                header="New Notes"
                :style="{ width: '25rem' }"
            >
                <div class="flex flex-column gap-1 mb-3">
                    <label for="newNoteTitle" class="font-semibold w-6rem"
                        >Title</label
                    >
                    <InputText
                        id="newNoteTitle"
                        class="flex-auto"
                        autocomplete="off"
                        v-model="newNote.title"
                    />
                </div>
                <div class="flex flex-column gap-1 mb-5">
                    <label for="email" class="font-semibold w-6rem"
                        >Description</label
                    >
                    <Textarea
                        autoResize
                        rows="10"
                        cols="30"
                        v-model="newNote.description"
                    />
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        @click="addNewNotesDialog = false"
                    ></Button>
                    <Button
                        type="button"
                        label="Save"
                        @click="addNewNotes(newNote)"
                    ></Button>
                </div>
            </Dialog>

            <!-- edit note form dialog -->

            <Dialog
                v-model:visible="editNotesDialog"
                modal
                header="Edit Notes"
                :style="{ width: '25rem' }"
            >
                <div class="flex flex-column gap-1 mb-3">
                    <label for="newNoteTitle" class="font-semibold w-6rem"
                        >Title</label
                    >
                    <InputText
                        id="newNoteTitle"
                        class="flex-auto"
                        autocomplete="off"
                        v-model="editNote.title"
                    />
                </div>
                <div class="flex flex-column gap-1 mb-5">
                    <label for="email" class="font-semibold w-6rem"
                        >Description</label
                    >
                    <Textarea
                        autoResize
                        rows="10"
                        cols="30"
                        v-model="editNote.description"
                    />
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        @click="editNotesDialog = false"
                    ></Button>
                    <Button
                        type="button"
                        label="Save"
                        @click="updateNotes(editNote)"
                    ></Button>
                </div>
            </Dialog>
        </div>
    </div>
</template>
<script>
import Button from "primevue/button";
import { NotesService } from "./services/NotesService.js";

export default {
    data() {
        return {
            notes: [],
            addNewNotesDialog: false,
            newNote: {
                title: "",
                description: "",
            },
            editNotesDialog: false,
            editNote: {
                id: "",
                title: "",
                description: "",
            },
        };
    },
    methods: {
        async fetchNotes() {
            const notes = await NotesService.getAllNotes();
            this.notes = notes;
        },
        async addNewNotes(note) {
            try {
                const res = await NotesService.insertNote(note);

                if (!res) {
                    throw new Error();
                }
                this.$toast.add({
                    severity: "success",
                    summary: "Success",
                    detail: "Success Adding New Note",
                    life: 3000,
                });
                this.addNewNotesDialog = false;
                this.newNote = {
                    title: "",
                    description: "",
                };

                this.fetchNotes();
            } catch (error) {
                this.$toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Error Adding New Note",
                    life: 3000,
                });
            }
        },

        selectNoteToEdit(id) {
            const note = this.notes.find((note) => note.id === id);
            this.editNote = { ...note };
            this.editNotesDialog = true;
        },
        async updateNotes(note) {
            try {
                const res = await NotesService.updateNote(note.id, note);

                if (!res) {
                    throw new Error();
                }
                this.$toast.add({
                    severity: "success",
                    summary: "Success",
                    detail: "Success Updating Note",
                    life: 3000,
                });
                this.editNotesDialog = false;
                this.fetchNotes();
            } catch (error) {
                console.log(error);

                this.$toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Error Updating Note",
                    life: 3000,
                });
            }
        },

        deleteNote(id) {
            this.$confirm.require({
                message: "Do you want to delete this note?",
                header: "Delete Note",
                icon: "pi pi-info-circle",
                rejectLabel: "Cancel",
                acceptLabel: "Delete",
                rejectClass: "p-button-secondary p-button-outlined",
                acceptClass: "p-button-danger",
                accept: () => {
                    this.confirmDelete(id)
                },
            });
        },

        async confirmDelete(id) {
            try {
                await NotesService.deleteNote(id);

                this.$toast.add({
                    severity: "info",
                    summary: "Confirmed",
                    detail: "Record deleted",
                    life: 3000,
                });
                this.fetchNotes();
            } catch (error) {
                this.$toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Note not deleted",
                    life: 3000,
                });
            }
        },
    },
    mounted() {
        this.fetchNotes();
    },
};
</script>
<style></style>
