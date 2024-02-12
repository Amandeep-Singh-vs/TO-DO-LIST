const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const messageDiv = document.querySelector("#message");
const clearButton = document.querySelector("#clearBtn");

// storing the tasks into array
let todoItems = [];

// As soon as the window gets loaded the tasks previously added will be fetched from the local storage
window.onload = ()=>{
    getLocalStorage();
}

// Created a customized div which will appear when an element is added or deleted
const showAlert = function (message, msgClass) {
    messageDiv.innerHTML = message;
    messageDiv.classList.add(msgClass, "show");
    messageDiv.classList.remove("hide");
    setTimeout(() => {
        messageDiv.classList.remove("show",msgClass);
        messageDiv.classList.add("hide");
    }, 2000);
    return;
};


// Created a function to show the updated list using the array taken for adding tasks
const getList = function (todoItems) {
    itemList.innerHTML = "";
    if (todoItems.length > 0) {
        todoItems.forEach((item) => {
            const iconClass = item.isDone ? "bi-check-circle-fill": "bi-check-circle";
            itemList.insertAdjacentHTML(
                "beforeend",
                `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="title" data-time="${item.addedAt}">${item.name}</span>
                    <span>
                        <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
                        <a href="#" data-delete><i class="bi bi-x-circle red"></i></a>
                    </span>
                </li>`
            );
            // now calling handle tasks for checking whether element is marked as done or is called for deletion
            handleItem(item);
        });
    }
    else {
        // When no tasks are present then show that no records are present
        itemList.insertAdjacentHTML(
            "beforeend",
            `<li class="list-group-item d-flex justify-content-between align-items-center">
                No record found.
            </li>`
        );
    }
};

// Function to get tasks array from local storage
const getLocalStorage = function () {
    const todoStorage = localStorage.getItem("todoItems");
    if (todoStorage === "undefined" || todoStorage === null) {
        todoItems = [];
    }
    else {
        todoItems = JSON.parse(todoStorage);
    }
    getList(todoItems);
};

// setting the todo list in the local storage
const setLocalStorage = function (todoItems) {
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

//  Event listener for adding new task into the list
document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = itemInput.value.trim();
        if (itemName.length === 0) {
            showAlert("Please enter task.", "alert-danger");
            return; 
        }
        else {
            const itemObj = {
                name: itemName,
                isDone: false,
                addedAt: new Date().getTime(),
            };
            todoItems.push(itemObj);
            setLocalStorage(todoItems);
            showAlert("New item has been added.", "alert-success");
            getList(todoItems);
        }
        itemInput.value = "";
    });
});

// Function to remove item from the list
const removeItem = function (item) {
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex, 1);
    setLocalStorage(todoItems)
};

// Function to check whether the task should be removed or added based on class added
const handleItem = function (itemData) {
    const items = document.querySelectorAll(".list-group-item");
    items.forEach((item) => {
        if (item.querySelector(".title").getAttribute("data-time") == itemData.addedAt)
        {
            item.querySelector("[data-done]").addEventListener("click", function (e) {
                e.preventDefault();
                const itemIndex = todoItems.indexOf(itemData);
                const currentItem = todoItems[itemIndex];
                const currentClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                currentItem.isDone = currentItem.isDone ? false : true;
                todoItems.splice(itemIndex, 1, currentItem);
                setLocalStorage(todoItems);
                const iconClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                this.firstElementChild.classList.replace(currentClass, iconClass);
            });

            item.querySelector("[data-delete]").addEventListener("click", function (e) {
                e.preventDefault();
                if (confirm("Are you sure want to delete?")) {
                    itemList.removeChild(item);
                    removeItem(item);
                    setLocalStorage(todoItems);
                    showAlert("Item has been deleted.", "alert-success");
                    return todoItems.filter((item) => item != itemData);
                }
                });
            }
    });
};