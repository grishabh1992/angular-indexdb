import { Component, OnInit } from '@angular/core';
import { IndexDbServiceService } from '../index-db.service.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { range } from "rxjs";


@Component({
    selector: 'app-complex-opration',
    templateUrl: './complex-opration.component.html',
    styleUrls: ['./complex-opration.component.scss']
})
export class ComplexOperationComponent implements OnInit {
    dbInstance: any;
    users = {
        list: [],
        filters: {
            operator: '',
            field: '',
            firstField: '',
            secondField: ''
        },
        operators: [
            { id: '<', value: 'Less Than', type: 'single' }, { id: '<=', value: 'Less Than And Equal', type: 'single' },
            { id: '>', value: 'Greater Than', type: 'single' }, { id: '>=', value: 'Greater Than And Equal', type: 'single' },
            { id: 'bound', value: 'Between', type: 'double' }, { id: 'boundequal', value: 'Between Equal', type: 'double' },
            { id: 'only', value: 'only', type: 'single' }
        ],
        pageObject: { currentPage: 1, pages: [], pageSize: 5, totalPages: 0 }
    }
    constructor(
        private indexDbServiceService: IndexDbServiceService,
        private http: Http
    ) { }
    ngOnInit() {
        let dbConf = {
            name: 'Users',
            index: 1,
            objectStores: [
                {
                    name: 'usersList',
                    options: {
                        keyPath: '_id'
                    },
                    indexs: [
                        {
                            name: 'name',
                            keyPath: 'name',
                            options: { unique: false }
                        },
                        {
                            name: 'email',
                            keyPath: 'email',
                            options: { unique: true }
                        },
                        {
                            name: 'company',
                            keyPath: 'company',
                            options: { unique: false }
                        },
                        {
                            name: 'age',
                            keyPath: 'age',
                            options: { unique: false }
                        },
                        {
                            name: 'balence',
                            keyPath: 'balence',
                            options: { unique: false }
                        }
                    ]
                }
            ]
        }
        this.indexDbServiceService.connect(dbConf, (db) => {
            this.dbInstance = db;
            this.populateDB();
        });
    }

    getList() {
        this.users.pageObject.pages = [];
        let listConfObject = {
            pageObject: {
                pageSize: this.users.pageObject.pageSize,
                currentPage: this.users.pageObject.currentPage
            },
            filters: JSON.parse(JSON.stringify(this.users.filters))
        };
        this.indexDbServiceService.getAllRecords(this.dbInstance, 'usersList', listConfObject, (result, error) => {
            console.log(result);
            this.users.pageObject.totalPages = Math.floor(result.count / this.users.pageObject.pageSize);
            for (let index = 0; index <= this.users.pageObject.totalPages; index++) {
                this.users.pageObject.pages.push(index + 1);
            }
            this.users.list = result.data;
        });
    }

    filterUser() {
        this.getList();
    }

    changePage(page) {
        this.users.pageObject.currentPage = page;
        this.getList();
    }

    populateDB() {
        this.http.get('./assets/users.json').pipe(
            map((res) => res.json())
        ).subscribe((success: any) => {
            success.forEach(element => {
                this.indexDbServiceService.createRecord(this.dbInstance, 'usersList', element, () => {
                });
            });
            this.getList();
        });
    }
}