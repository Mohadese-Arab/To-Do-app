//---- DOM selector ----//
const tasksList = document.getElementById("tasksList");
const doneTasksList = document.getElementById("doneTasksList");
const taskInput = document.getElementById("taskInput");
const toDoForm = document.querySelector(".toDoForm");
const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const toDoTaskWrapper = document.getElementById("toDoTasksWrapper");
const todayEl = document.querySelector(".today");

//---- api ----//
const tasksUrl = "http://localhost:3000/tasks";
const doneTasksUrl = "http://localhost:3000/doneTasks";

//---- Date info ----//
let today = new Date().getDay();
let date = new Date().getDate();
let month = new Date().getMonth();
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August",
"September", "October", "November", "December"];

todayEl.innerHTML = `${dayNames[today - 1]}, ${date} ${monthNames[month]}`;

//---- CRUD ----//
//---- get to do tasks and print them in their list ----//
const getTasks = async () => {
  try {
    const res = await fetch(tasksUrl);
    const tasks = await res.json();
    for (let task of tasks) {
      tasksList.innerHTML += `<li class="d-flex align-center justify-between">
          ${task.title}
          <div class="btn-container d-flex" id=${task.id}>
            <i class="fa-solid fa-trash deleteBtn d-flex align-center" title="Delete"></i>
            <i class="fa-solid fa-pencil editBtn d-flex align-center" title="Edit"></i>
            <i class="fa-solid fa-check checkBtn d-flex align-center" title="Done"></i>
          </div>
        </li>`;
      if (tasks.length > 8) {
        tasksList.style.overflowY = "scroll";
        tasksList.style.paddingRight = "5px";
      }
    }
  } catch (error) {
    console.log(error);
  }
};
getTasks();

//---- create task function ----//
const createTasks = async (data) => {
  const res = await fetch(tasksUrl, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
};

//---- Form Submit ----//
addBtn.addEventListener("click", async () => {
  let inputValue = taskInput.value.trim();
  const data = {
    title: inputValue,
  };
  taskInput.value = "";

  if (inputValue) {
    await createTasks(data);
  } else {
    alert("Enter your task please!");
  }
});

//---- Delete to do task function ----//
const deleteTask = async (id) => {
  const res = await fetch(tasksUrl + `/${id}`, {
    method: "DELETE",
  });
};

//---- get the task for edit ----//
const getTheTask = async (id) => {
  const res = await fetch(tasksUrl + `/${id}`);
  const task = await res.json();
  taskInput.value = task.title;
  toDoForm.id = id;
};

//---- Edit task function ----//
const editTask = async (data) => {
  let id = toDoForm.id;
  const res = await fetch(tasksUrl + `/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
};

//---- edit task submit ----//
editBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let inputValue = taskInput.value.trim();
  const data = {
    title: inputValue,
  };
  if(inputValue) {
    await editTask(data);
  } else {
    alert("Write your task please")
  }
  
});

//---- Get the done task and send to done list ----//
const getDoneTask = async (id) => {
  const res = await fetch(tasksUrl + `/${id}`);
  const task = await res.json();
  const data = {
    title: task.title,
  };
  await postDoneTask(data);
};

//---- Post done task ----//
const postDoneTask = async (data) => {
  const res = await fetch(doneTasksUrl, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
};

//---- delete, edit and check task in List ---//
tasksList.addEventListener("click", async (e) => {
  const id = e.target.parentElement.id;
  if (e.target.classList.contains("deleteBtn")) {
    const li = e.target.parentElement.parentElement;
    const makeSure = confirm("Are you sure you want to delete this task?");
    if (makeSure) {
      li.style.opacity = "0";
      await deleteTask(id);
    }
  } else if (e.target.classList.contains("editBtn")) {
    taskInput.focus();
    await getTheTask(id);
    addBtn.style.display = "none";
    addBtn.style.scale = "0";
    editBtn.style.scale = "1";
  } else if (e.target.classList.contains("checkBtn")) {
    const li = e.target.parentElement.parentElement;
    li.style.transform = "translateY(100%)";
    li.style.opacity = "0";
    await getDoneTask(id);
    await deleteTask(id);
  }
});

//---- get done tasks and print them in their list ----//
const getDoneTasks = async () => {
  try {
    const res = await fetch(doneTasksUrl);
    const tasks = await res.json();
    for (let task of tasks) {
      doneTasksList.innerHTML += `<li class="d-flex align-center justify-between">
          ${task.title}
          <div class="btn-container d-flex"  id=${task.id}>
            <i class="fa-solid fa-trash deleteBtn d-flex align-center" title="Delete"></i>
            <i class="fa-solid fa-undo undoBtn d-flex align-center" title="Undo"></i>
          </div>
        </li>`;
      if (tasks.length > 9) {
        doneTasksList.style.overflowY = "scroll";
        doneTasksList.style.paddingRight = "5px";
      }

    }
  } catch (error) {
    console.log(error);
  }
};
getDoneTasks();

//---- Delete done task function ----//
const deleteDoneTask = async (id) => {
  const res = await fetch(doneTasksUrl + `/${id}`, {
    method: "DELETE",
  });
};

//---- get task for undo ----//
const getUndoTask = async (id) => {
  const res = await fetch(doneTasksUrl + `/${id}`);
  const task = await res.json();
  const data = {
    title: task.title,
  };
  await postUndoTask(data);
};

//---- post done task to to-do tasks function ----//
const postUndoTask = async (data) => {
  const res = await fetch(tasksUrl, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
};

//---- Delete and Undo tasks in done tasks list ----//
doneTasksList.addEventListener("click", async (e) => {
  const id = e.target.parentElement.id;
  if (e.target.classList.contains("deleteBtn")) {
    const li = e.target.parentElement.parentElement;
    const makeSure = confirm("Are you sure you want to delete this task?");
    if (makeSure) {
      li.style.opacity = "0";
      await deleteDoneTask(id);
    }
  } else if (e.target.classList.contains("undoBtn")) {
    const li = e.target.parentElement.parentElement;
    li.style.transform = "translateY(100%)";
    li.style.opacity = "0";
    await getUndoTask(id);
    await deleteDoneTask(id);
  }
});

//--- default focus on input ---//
taskInput.focus();