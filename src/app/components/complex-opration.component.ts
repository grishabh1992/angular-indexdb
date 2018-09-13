import { Component, OnInit } from '@angular/core';
import { IndexDbServiceService } from '../index-db.service.service';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
@Component({
    selector: 'app-complex-opration',
    templateUrl: './complex-opration.component.html',
    styleUrls: ['./complex-opration.component.scss']
})
export class ComplexOperationComponent implements OnInit {
    dbInstance: any;
    users = {
        list: [],
        allList: [],
        pageObject: { currentPage: 1, pageSize: 5, totalPages: 0 }
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
                            keyPath: 'email',
                            options: { unique: false }
                        }
                    ]
                }
            ]
        }
        this.indexDbServiceService.connect(dbConf, (db) => {
            this.dbInstance = db;
            this.populateDB();
            this.getList();
        });
    }

    getList() {
        this.indexDbServiceService.getAllRecords(this.dbInstance, 'usersList', 1, (result, error) => {
            this.users.allList = result;
            this.users.pageObject.totalPages = Math.floor(result / this.users.pageObject.pageSize);
        });
    }

    showAPageRecord() {

    }
    populateDB() {
        this.http.get('./assets/users.json').pipe(
            map((res) => res.json())
        ).subscribe((success: any) => {
            this.users.allList = success;
            success.forEach(element => {
                this.indexDbServiceService.createRecord(this.dbInstance, 'usersList', element, function () { });
            });
        });
    }
}