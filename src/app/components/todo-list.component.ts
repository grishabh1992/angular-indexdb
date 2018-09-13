import { Component, OnInit } from '@angular/core';
import { IndexDbServiceService } from '../index-db.service.service';
import { async } from 'q';
@Component({
    selector: 'app-todo',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
    dbInstance: any;
    notes = {
        list: [],
        instance: {
            title: '',
            description: ''
        },
        notification: {
            type: '',
            message: ''
        },
        formType: ''
    };
    constructor(private indexDbServiceService: IndexDbServiceService) { }
    ngOnInit() {
        let dbConf = {
            name: 'NotesApp',
            index: 1,
            objectStores: [
                {
                    name: 'todoList',
                    options: {
                        keyPath: 'title'
                    },
                    indexs: [
                        {
                            name: 'description',
                            keyPath: 'description',
                            options: { unique: false }
                        }
                    ]
                }
            ]
        }
        this.indexDbServiceService.connect(dbConf, (db) => {
            this.dbInstance = db;
            this.getList();
        });
    }

    createUser() {
        this.indexDbServiceService.createRecord(this.dbInstance, 'todoList',
            this.notes.instance, (result, error) => {
                if (result) {
                    this.notes.notification.type = 'success';
                    this.notes.notification.message = 'Note added successfully';
                    this.resetNote();
                    this.getList();
                } else {
                    this.notes.notification.type = 'error';
                    this.notes.notification.message = 'Something wrong, Try later.';
                }
            });
    }

    resetNote(note?: any) {
        if (note) {
            this.notes.instance.description = note.description;
            this.notes.instance.title = note.title;
        } else {
            this.notes.instance.description = '';
            this.notes.instance.title = '';
        }
    }

    editNote(note) {
        this.resetNote(note);
        this.notes.formType = 'edit';
    }

    updateNote(note) {
        this.indexDbServiceService.updateRecord(this.dbInstance, 'todoList',
            this.notes.instance, (result, error) => {
                if (result) {
                    this.notes.notification.type = 'success';
                    this.notes.notification.message = 'Note updated successfully';
                    this.resetNote();
                    this.getList();
                } else {
                    this.notes.notification.type = 'error';
                    this.notes.notification.message = 'Something wrong, Try later.';
                }
            });
    }


    deleteNote(entityObject) {
        console.log(entityObject)
        this.indexDbServiceService.deleteRecord(this.dbInstance, 'todoList', entityObject.title, (result, error) => {
            console.log(`${result ? 'success' : error}`);
            this.getList();
        });
    }

    getRecord() {
        this.indexDbServiceService.getRecord(this.dbInstance, 'todoList', 1, (result, error) => {
            console.log(`${result ? 'success' : error}`);
        });
    }

    getList() {
        this.indexDbServiceService.getAllRecords(this.dbInstance, 'todoList', 1, (result, error) => {
            this.notes.list = result;
        });
    }

}