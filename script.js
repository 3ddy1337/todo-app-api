const todoList = document.getElementById("todo-list");
const form = document.getElementById("todo-form");
const inputField = document.getElementById("input-field");

// State
let state = {
  todos: [],
};

// Render
function render() {
  todoList.innerHTML = "";

  state.todos.forEach((todo) => {
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

render();

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

refresh();
