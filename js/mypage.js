// create a variable for indexed db
let db;

const note = document.querySelector("#note");
const form = document.querySelector("form");
const list = document.querySelector("ul");

// when the window is opened the following scripts are running
window.onload = () => {
  // create and open an indexed db with name [notes] and version 1
  let request = window.indexedDB.open("notes", 1);

  request.onerror = function () {
    console.log("Database failed to open");
  };

  // here is the place when db is successfully created we dispaly out data
  request.onsuccess = function () {
    console.log("Database opened successfully");

    db = request.result;
    displayData();
  };

  request.onupgradeneeded = function (e) {
    let db = e.target.result;
    // object store is like table in db
    let objectStore = db.createObjectStore("notes", {
      keyPath: "id",
      autoIncrement: true,
    });

    // create index in object store [like columns]
    objectStore.createIndex("note", "note", { unique: false });

    console.log("Database setup complete");
  };

  // addData is called when the form is submitted
  form.onsubmit = addData;

  // add data into db
  function addData(e) {
    // prevent browser to refresh
    e.preventDefault();

    let newItem = { note: note.value };

    // create a transaction to write to db
    let transaction = db.transaction(["notes"], "readwrite");
    let objectStore = transaction.objectStore("notes");
    let request = objectStore.add(newItem);

    request.onsuccess = () => {
      note.value = "";
    };

    transaction.oncomplete = () => {
      console.log("Transaction completed on the database");
      displayData();
    };

    transaction.onerror = () => {
      console.log("Transaction not completed, error!!!");
    };
  }

  // read data from db
  function displayData() {
    // removing items from list to avoid repetition
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    // read data from database to populate the list
    // create a transaction to read data from db
    let objectStore = db.transaction("notes").objectStore("notes");
    objectStore.openCursor().onsuccess = function (e) {
      let cursor = e.target.result;
      // we need cursor to read data
      if (cursor) {
        let listItem = document.createElement("li");
        let note = document.createElement("p");

        listItem.appendChild(note);
        list.appendChild(listItem);

        note.textContent = cursor.value.note;

        listItem.setAttribute("data-note-id", cursor.value.id);

        // add delete button for each list item
        let deleteButton = document.createElement("button");
        listItem.appendChild(deleteButton);
        deleteButton.textContent = "Delete";

        deleteButton.onclick = deleteItem;

        cursor.continue();
      } else {
        if (!list.firstChild) {
          let listItem = document.createElement("li");
          listItem.textContent = "Add your favourite food";
          list.appendChild(listItem);
        }
      }
      console.log("notes displayed!!!");
    };
  }

  // delete data from db
  function deleteItem(e) {
    let noteId = Number(e.target.parentNode.getAttribute("data-note-id"));

    // create a transaction to write to db
    let transaction = db.transaction(["notes"], "readwrite");
    let objectStore = transaction.objectStore("notes");
    let request = objectStore.delete(noteId);

    transaction.oncomplete = () => {
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);

      console.log(`Note ${noteId} is deleted!`);

      if (!list.firstChild) {
        let listItem = document.createElement("li");
        listItem.textContent = "Add your favourite food";
        list.appendChild(listItem);
      }
    };
  }
};
