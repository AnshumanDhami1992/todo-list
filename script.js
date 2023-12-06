
// =================================Retriving DOM Elements=========================================================

const todoValue = document.getElementById("list_text");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list_items");
const addUpdate = document.getElementById("AddUpdateClick");
const popup = document.querySelector(".edit_todo");




//==================================== Initializing variables===========================================


let updateText;
let todo = JSON.parse(localStorage.getItem("todo-list")) || [];



//===================================== Function to display existing todo items===================================

function readToDoItems() {
    listItems.innerHTML = "";//==== Clearing the list


//================================= Iterating through each todo item in the array======================================

    todo.forEach((element) => {
        const li = document.createElement("li");// Creating list item element
        let style = element.status ? "text-decoration: line-through" : "";
        
//==================== Creating HTML structure for todo items with edit and delete buttons=========================

        const todoItems = `<div style="${style}" ondblclick="completeToDoItem(this)">${element.item}${style === "" ? '<img class="edit todo-controls" onClick="updateToDoItem(this)" src="pencil.png"/>' : ""}<img class="delete todo-controls" onclick="deleteToDoItem(this)" src="trash.png"/></div>`;
        
        // Adding the todo item HTML to the list
        li.innerHTML = todoItems;
        listItems.appendChild(li);
    });
}
readToDoItems();

//==================== Event listener for 'Enter' keypress in todo input===============

todoValue.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addUpdate.click();
    }
});


//=========================== Function to create a new todo item========================================================

function createToDoItem() {
    if (todoValue.value === "") {
        setAlertMessage("Please enter your todo text!");
        todoValue.focus();
        return;
    }

     //============== Checking if the item is already present in the list===============

    const isPresent = todo.some((element) => element.item === todoValue.value);
    if (isPresent) {
        setAlertMessage("This item is already present in the list!");
        return;
    }

    //============ Creating HTML for new todo item=======

    const li = document.createElement("li");
    const todoItems = `<div title="Double click to mark as completed" ondblclick="completeToDoItem(this)">${todoValue.value}</div><div><img class="edit todo-controls" onclick="updateToDoItem(this)" src="pencil.png"/><button class="edit_controls" onclick="updatePopup(this)">Edit</button><img class="delete todo-controls" onclick="deleteToDoItem(this)" src="trash.png"/></div>`;
  
    //======== Adding new todo item HTML to the list========

    li.innerHTML = todoItems;
    listItems.appendChild(li);

    //========== Adding new todo item to the array============
    todo.push({ item: todoValue.value, status: false });
    setLocalStorage();
    todoValue.value = "";
    setAlertMessage("Todo item created successfully!");
}

//================================== Function to mark a todo item as completed=======================================

function completeToDoItem(element) {
    element.style.textDecoration = "line-through";
    element.querySelector(".edit").remove();

    todo.forEach((item) => {
        if (item.item === element.innerText.trim()) {
            item.status = true;
        }
    });

    setLocalStorage();
    setAlertMessage("Todo item completed successfully!");
}


//================================ Function to update the status of a todo item===================================================

function updateToDoItem(element) {
    const divElement = element.parentElement.parentElement.querySelector("div");
    if (divElement.style.textDecoration === "") {
        divElement.style.textDecoration = "line-through";
        element.remove();

        todo.forEach((item) => {
            if (item.item === divElement.innerText.trim()) {
                item.status = true;
            }
        });

        setLocalStorage();
        setAlertMessage("Task Done successfully!");
    }
}



//================================ Function to delete a todo item=============================================================


function deleteToDoItem(element) {
    const deleteValue = element.parentElement.parentElement.querySelector("div").innerText.trim();
    
    const parentElement = element.parentElement.parentElement;
    parentElement.classList.add("deleted-item");
    parentElement.style.animation = "removed-item-animation 1s cubic-bezier(0.55, -0.04, 0.91, 0.94) forwards";
    parentElement.style.transformOrigin = "0% 100%";

    setTimeout(() => {
        parentElement.remove(); 
        todo = todo.filter((el) => el.item !== deleteValue);
        setLocalStorage();
        setAlertMessage("Todo item deleted successfully!");
    }, 1000); 
}







//============================ Function to update local storage with the current todo list========================

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}


//=============================== Function to display alert messages==========================

function setAlertMessage(message) {
    todoAlert.removeAttribute("class");
    todoAlert.innerText = message;
    setTimeout(() => {
        todoAlert.classList.add("toggleMe");
    }, 1000);
}



//================================= Function to handle editing a todo item in a popup=======================================

function updatePopup(selectedItem) {
    const popupInput = document.querySelector(".edit_input");
    popupInput.value = selectedItem.parentElement.parentElement.querySelector("div").innerText.trim();

    popup.style.display = 'flex';
    const updateButton = document.querySelector(".edit_todo button:nth-of-type(1)");

    updateButton.onclick = function() {
        const updatedValue = popupInput.value.trim();
        if (updatedValue !== '') {
            selectedItem.parentElement.parentElement.querySelector("div").innerText = updatedValue;

            todo.forEach((item) => {
                if (item.item === selectedItem.parentElement.parentElement.querySelector("div").innerText.trim()) {
                    item.item = updatedValue;
                }
            });

            setLocalStorage();
            setAlertMessage("Todo item updated successfully!");
            closePopup();
        } else {
            alert("Please enter a valid value");
        }
    };
}


//======================================== Function to close the editing popup============================================

function closePopup() {
    popup.style.display = 'none';
}
