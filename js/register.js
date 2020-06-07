// create a variable for indexed db
let db;

const note = document.querySelector("#note");
const name = document.querySelector("#name");
const email = document.querySelector("#email");
const form = document.querySelector("form");
const list = document.querySelector("ul");

// when the window is opened the following scripts are running
window.onload = () => {
  // create and open an indexed db with name [register] and version 1
  let request = window.indexedDB.open("register", 1);

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
    let objectStore = db.createObjectStore("register", {
      keyPath: "id",
      autoIncrement: true,
    });

    // create index in object store [like columns]
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("email", "email", { unique: false });
    

    console.log("Database setup complete");
  };

  // addData is called when the form is submitted
  form.onsubmit = addData;

  // add data into db
  function addData(e) {
    // prevent browser to refresh
    e.preventDefault();

    let fName = { name: name.value };
    let fEmail={email:email.value};
    
   


    // create a transaction to write to db
    let transaction = db.transaction(["register"], "readwrite");
    let objectStore = transaction.objectStore("register");
    var Group =
    {
      name:fName,
      Email:fEmail
    }
    let request = objectStore.add(Group);
   
    request.onsuccess = function (e) {
      console.log("User Added");
  }
    

    request.onsuccess = () => {
      name.value = "";
      email.value=""
    };

    transaction.oncomplete = () => {
      console.log("Transaction completed on the database");
      displayData();
    };

    transaction.onerror = () => {
      console.log("Transaction not completed, error!!!");
    };
  }  
};
