import { Injectable, InjectionToken, Inject } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});
// @Inject(BROWSER_STORAGE) private store: Storage

@Injectable({
  providedIn: 'root'
})
export class IndexDbServiceService {

  constructor() { }

  connect(dbConf, callback) {
    let dBOpenRequest;
    if (dbConf.index) {
      dBOpenRequest = indexedDB.open(dbConf.name, dbConf.index);
    } else {
      dBOpenRequest = indexedDB.open(name);
    }
    dBOpenRequest.onerror = function (event) {
      return callback(null, event.target);
    };
    dBOpenRequest.onsuccess = function (event) {
      let db = event.target['result'];
      return callback(db);
    };
    dBOpenRequest.onupgradeneeded = function (event) {
      let db = event.target['result'];
      console.log('dbConf', dbConf.objectStores)
      dbConf.objectStores.forEach(element => {
        let objectStore = db.createObjectStore(element.name, element.options);
        if (element.indexs && element.indexs.length) {
          element.indexs.forEach(indexObject => {
            objectStore.createIndex(indexObject.name, indexObject.keyPath, indexObject.options);
          });
        }
      });
    }
  }

  deleteRecord = function (db, objectStoreName, key, callback) {
    let transaction = db.transaction(objectStoreName, "readwrite");
    let objectStoreInstance = transaction.objectStore(objectStoreName);
    let objectStoreRequest = objectStoreInstance.delete(key);
    transaction.oncomplete = function (event) {
      callback(true);
    };
    transaction.onerror = function (event) {
      callback(null, event);
    };
    objectStoreRequest.onsuccess = function (event) {
      console.log('Request successful.');
    };
    objectStoreRequest.onerror = function (event) {
      console.log(event, 'Request Error.');
    };
  }

  createRecord = function (db, objectStoreName, newObject, callback) {
    let transaction = db.transaction(objectStoreName, "readwrite");
    let objectStoreInstance = transaction.objectStore(objectStoreName);
    objectStoreInstance.add(newObject);
    transaction.oncomplete = function (event) {
      callback(true);
    };
    transaction.onerror = function (event) {
      callback(null, event);
    };
  }

  updateRecord = function (db, objectStoreName, newObject, callback) {
    let transaction = db.transaction(objectStoreName, "readwrite");
    let objectStoreInstance = transaction.objectStore(objectStoreName);
    let objectStoreRequest = objectStoreInstance.put(newObject);
    transaction.oncomplete = function (event) {
      callback(true);
    };
    transaction.onerror = function (event) {
      callback(null, event);
    };
    objectStoreRequest.onsuccess = function (event) {
      console.log('Request successful.');
    };
    objectStoreRequest.onerror = function (event) {
      console.log(event, 'Request Error.');
    };
  }



  getRecord = function (db, objectStoreName, key, callback) {
    let transaction = db.transaction(objectStoreName, "readwrite");
    let objectStoreInstance = transaction.objectStore(objectStoreName);
    let objectStoreRequest = objectStoreInstance.get(key);
    transaction.oncomplete = function (event) {
      callback(objectStoreRequest.result);
    };
    transaction.onerror = function (event) {
      callback(null, event);
    };
  }

  getAllRecords = function (db, objectStoreName, confObject, callback) {
    let transaction = db.transaction(objectStoreName, "readonly");
    let objectStoreInstance = transaction.objectStore(objectStoreName);
    let listObject = { count: 0, data: [] };
    let range = this.getRange(confObject.filters) || {};
    let queryOver;
    if (confObject.filters.operator && confObject.filters.operator.id && confObject.filters.field) {
      queryOver = objectStoreInstance.index(confObject.filters.field)
      queryOver = queryOver.openCursor(range);
      objectStoreInstance.index(confObject.filters.field).count().onsuccess = function (e) {
        listObject.count = e.target.result;
      }
    } else {
      queryOver = objectStoreInstance.openCursor();
      objectStoreInstance.count().onsuccess = function (e) {
        listObject.count = e.target.result;
      }
    }

    let index = 0;
    queryOver.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        if (confObject && confObject.pageObject && confObject.pageObject.pageSize) {
          let lIndex = confObject.pageObject.pageSize * (confObject.pageObject.currentPage - 1);
          let uIndex = (confObject.pageObject.pageSize * (confObject.pageObject.currentPage)) - 1;
          if ((index > uIndex)) {
            transaction.abort();
            callback(listObject);
          } else {
            if ((index >= lIndex)) {
              listObject.data.push(cursor.value)
            }
            index++;
            cursor.continue();
          }
        } else {
          listObject.data.push(cursor.value);
          cursor.continue();
        }
      }
    };
    transaction.oncomplete = function (event) {
      callback(listObject);
    };
  }

  getRange(filter) {
    let result;
    console.log(filter, filter.operator.id)
    if (Number(filter.firstField) != NaN) {
      filter.firstField = Number(filter.firstField);
    }
    if (Number(filter.secondField) != NaN) {
      filter.secondField = Number(filter.secondField);
    }
    switch (filter.operator.id) {
      case '<':
        result = IDBKeyRange.upperBound(filter.firstField, true);
        break;
      case '<=':
        result = IDBKeyRange.upperBound(filter.firstField, false);
        break;
      case '>=':
        result = IDBKeyRange.lowerBound(filter.firstField, false);
        break;
      case '>':
        result = IDBKeyRange.lowerBound(filter.firstField, true);
        break;
      case 'bound':
        result = IDBKeyRange.bound(filter.firstField, filter.secondField, true, true);
        break;
      case 'boundequal':
        result = IDBKeyRange.bound(filter.firstField, filter.secondField, false, false);
        break;
      case 'only':
        result = IDBKeyRange.only(filter.firstField);
        break;
    }
    return result;
  }

}
