'use strict'
let gameEventStorageDB;

self.addEventListener('message',(ev)=>{
    const msg = ev.data;
    postMessage(msg[0]);

    switch (msg[0]) {
      case "init" : 
        const eventStorageDB = indexedDB.open("gameEventStorage");
        eventStorageDB.addEventListener("upgradeneeded",(ev)=>{
            const db = ev.target.result;
            const objectStore = db.createObjectStore("gameEventStorage", { autoIncrement: true });
            postMessage("Successfully upgraded db");
        });
        eventStorageDB.addEventListener("error",(ev)=>{
            postMessage("soory something went wrong when creating IndexedDB - verify that you allow to use IndexedDB");
        });
        eventStorageDB.addEventListener("success",(ev)=>{
            gameEventStorageDB = ev.target.result;
            gameEventStorageDB.transaction(["gameEventStorage"], "readwrite")
            .objectStore("gameEventStorage")
            .add({ name: "User created just for the test" });
        })

    } 

});

