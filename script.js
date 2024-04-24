const addTodoForm = document.querySelector(".add-todo-form");
const todoInput = document.querySelector(".todo-input");
const allTodos = document.querySelector(".all-todos");
const filterOption = document.querySelector("#select");
const searchInput = document.querySelector("#search-input");

let todoLists = [];
let selectedListId;
let newName;

addTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  todoLists.push(newTodo(todoInput.value));
  todoInput.value = "";
  render(todoLists);
});

function newTodo(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

allTodos.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "button") {
    selectedListId = e.target.dataset.buttonId;
    if (e.target.innerText === "Delete") {
      deleteTodo();
    }
    if (e.target.innerText === "Update") {
      editView();
      listenUpdate();
    }
    if (e.target.innerText === "Cancel") {
      render(todoLists);
    }
  }
  if (e.target.type === "checkbox") {
    selectedListId = e.target.dataset.boxId;
    toggleComplete();
  }
});

function listenUpdate() {
  allTodos.addEventListener('change', e => {
    if (e.target.id === 'update-input') {
      // console.log(e.target);
      // console.log(e.target.value);
      newName = e.target.value;
    }
  })
  allTodos.addEventListener('click', e => {
    if (e.target.innerText === 'Save') {
      processUpdatedLists(newName);
    }
  })
}

function render(lists) {
  clear();
  lists.forEach((list) => {
    notEditView(list);
  });
}

function notEditView(list) {
  const divElement = document.createElement("div");
  const checkBoxElement = document.createElement("input");
  const labelElement = document.createElement("label");
  const deleteButtonElement = document.createElement("button");
  const updateButtonElement = document.createElement("button");

  updateButtonElement.dataset.buttonId = list.id;
  deleteButtonElement.dataset.buttonId = list.id;
  checkBoxElement.dataset.boxId = list.id;
  checkBoxElement.type = "checkbox";
  checkBoxElement.defaultChecked = list.complete;
  labelElement.innerText = list.name;
  deleteButtonElement.innerText = "Delete";
  updateButtonElement.innerText = "Update";

  checkBoxElement.className = 'form-check-input me-2';
  deleteButtonElement.className = 'btn btn-sm btn-danger float-end';
  updateButtonElement.className = 'btn btn-sm btn-primary float-end mx-2';
  divElement.className = 'list-group-item';

  divElement.appendChild(checkBoxElement);
  divElement.appendChild(labelElement);
  divElement.appendChild(deleteButtonElement);
  divElement.appendChild(updateButtonElement);
  allTodos.appendChild(divElement);
}

function editView() {
  clear();
  todoLists.forEach((list) => {
    if (list.id === selectedListId) {
      const divElement = document.createElement("div");
      const inputElement = document.createElement("input");
      const cancelButtonElement = document.createElement("button");
      const saveButtonElement = document.createElement("button");

      saveButtonElement.dataset.buttonId = list.id;
      cancelButtonElement.innerText = "Cancel";
      saveButtonElement.innerText = "Save";
      saveButtonElement.type = "submit";
      inputElement.type = 'text';
      inputElement.id = 'update-input';

      divElement.className = 'list-group-item text-center pt-5';
      inputElement.className = 'form-control';
      saveButtonElement.className = 'btn btn-dark btn-sm m-3';
      cancelButtonElement.className = 'btn btn-light bg-light btn-sm m-3';

      divElement.appendChild(inputElement);
      divElement.appendChild(saveButtonElement);
      divElement.appendChild(cancelButtonElement);
      allTodos.appendChild(divElement);
    } else {
      notEditView(list);
    }
  });
}

function clear() {
  while (allTodos.firstChild) {
    allTodos.removeChild(allTodos.firstChild);
  }
}

function deleteTodo() {
  todoLists = todoLists.filter((list) => list.id !== selectedListId);
  // console.log(lists);
  // console.log(selectedListId);
  selectedListId = null;
  render(todoLists);
}

function toggleComplete() {
  todoLists = todoLists.map((list) => {
    if (list.id === selectedListId) {
      return { ...list, complete: !list.complete };
    }
    return list;
  });
  render(todoLists);
}

function processUpdatedLists(newName) {
  todoLists = todoLists.map((list) => {
    if (list.id === selectedListId) {
      return { ...list, name: newName };
    }
    return list;
  });
  render(todoLists);
}

filterOption.addEventListener("change", filterTodo);

function filterTodo(e) {
  let display = todoLists;
  switch (e.target.value) {
    case "all":
      render(display);
      break;
    case "uncompleted":
      display = todoLists.filter((list) => list.complete === false);
      render(display);
      break;
    case "completed":
      display = todoLists.filter((list) => list.complete === true);
      render(display);
  }
}

searchInput.addEventListener("keyup", (e) => {
  let display = todoLists;
  let value = e.target.value.toLowerCase();
  display = todoLists.filter(
    (list) => list.name.toLowerCase().indexOf(value) != -1
  );
  render(display);
});


