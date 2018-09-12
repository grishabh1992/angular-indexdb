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
    // objectStoreRequest.onsuccess = function (event) {
    //   console.log(objectStoreRequest.result, 'Request successful.', event.target.result);
    // };
    // objectStoreRequest.onerror = function (event) {
    //   console.log(event, 'Request Error.');
    // };
  }

  getAllRecords = function (db, objectStoreName, key, callback) {
    let transaction = db.transaction(objectStoreName, "readwrite");
    let objectStoreInstance = transaction.objectStore(objectStoreName);
    let list = [];
    objectStoreInstance.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        list.push(cursor.value)
        cursor.continue();
      }
    };
    transaction.oncomplete = function (event) {
      callback(list);
    };
  }

}
