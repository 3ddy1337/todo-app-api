const todoList = document.getElementById("todo-list");
const form = document.getElementById("todo-form");
const inputField = document.getElementById("input-field");
const all = document.getElementById("all");
const open = document.getElementById("open");
const done = document.getElementById("done");
const removeButton = document.getElementById("remove-button");

// State
let state = {
  todos: [],
};

// Render
function render() {
  todoList.innerHTML = "";

  state.todos.forEach((todo) => {
    if (done.checked && !todo.done) {
      return;
    }
    if (open.checked && todo.done) {
      return;
    }

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = todo.done;
    input.name = "done";

    input.addEventListener("change", () => {
      todo.done = input.checked;

      fetch("http://localhost:4730/todos/" + todo.id, {
        method: "PUT",
        body: JSON.stringify({
          description: todo.description,
          done: todo.done,
        }),
        headers: {
          "Content-Type": "appLication/json",
        },
      })
        .then((response) => {
          console.log("response", response);
          return response.json();
          refresh();
        })
        .then((data) => {
          console.log("data", data);
          refresh();
        });
    });

    const label = document.createElement("label");
    label.append(input, todo.description);
    const listItem = document.createElement("li");
    listItem.append(label);
    todoList.append(listItem);
  });
}

// Refresh
function refresh() {
  // GET
  fetch("http://localhost:4730/todos")
    .then((response) => {
      console.log("response", response);
      return response.json();
    })
    .then((data) => {
      console.log("data", data);
      state.todos = data;
      render();
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = inputField.value.trim();

  if (description === "") {
    alert("Please insert Todo");
    return;
  }

  for (let i = 0; i < state.todos.length; i++) {
    const todo = state.todos[i];
    if (todo.description.toLowerCase() === description.toLowerCase()) {
      alert("Todo already exists");
      return;
    }
  }

  const newTodo = {
    description,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    body: JSON.stringify(newTodo),
    headers: {
      "Content-Type": "appLication/json",
    },
  })
    .then((response) => {
      console.log("response", response);
      return response.json();
    })
    .then((data) => {
      console.log("data", data);

      refresh();
    });
  inputField.value = "";
});

all.addEventListener("change", () => {
  state.filter = "all";
  // saveState();
  render();
});

open.addEventListener("change", () => {
  state.filter = "open";
  // saveState();
  render();
});

done.addEventListener("change", () => {
  state.filter = "done";
  // saveState();
  render();
});

removeButton.addEventListener("click", () => {
  const doneTodos = state.todos.filter((todo) => todo.done);
  doneTodos.forEach((todo) => {
    fetch("http://localhost:4730/todos/" + todo.id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {});
    refresh();
  });
});

console.log(state);

refresh();
render();
