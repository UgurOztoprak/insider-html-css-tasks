const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filterDropdown = document.getElementById("filterDropdown");
const sortDropdown = document.getElementById("sortDropdown");

// Adding new task
function addTask() {
  try {
    const taskText = taskInput.value.trim();
    const priority = document.querySelector('input[name="priority"]:checked');

    if (taskText === "") {
      alert("Please enter a task.");
      return;
    }

    if (!priority) {
      alert("Please select a priority.");
      return;
    }

    const li = document.createElement("li");
    li.setAttribute("data-priority", priority.value);
    li.setAttribute("data-completed", "false");

    // Checkbox create
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";

    checkbox.addEventListener("change", () => {
      const span = li.querySelector(".task-text");
      const completed = checkbox.checked;
      li.setAttribute("data-completed", completed);

      if (completed) {
        span.style.textDecoration = "line-through";
        span.style.color = "#999";
      } else {
        span.style.textDecoration = "none";
        span.style.color = "#ddd";
      }

      applyFiltersAndSort();
    });

    // Priority
    const priorityCircle = document.createElement("span");
    priorityCircle.className = "task-priority-circle";

    if (priority.value === "Low") {
      priorityCircle.style.backgroundColor = "#7f8c8d";
    } else if (priority.value === "Medium") {
      priorityCircle.style.backgroundColor = "#f1c40f";
    } else if (priority.value === "High") {
      priorityCircle.style.backgroundColor = "#e74c3c";
    }

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = taskText;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      li.remove();
    });

    li.appendChild(checkbox);
    li.appendChild(priorityCircle);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    taskInput.value = "";
    document
      .querySelectorAll('input[name="priority"]')
      .forEach((r) => (r.checked = false));

    applyFiltersAndSort();
  } catch (error) {
    alert("An unexpected error occurred: " + error.message);
    console.error(error);
  }
}

// Filter listing
function applyFiltersAndSort() {
  const tasks = Array.from(taskList.querySelectorAll("li"));

  const filterValue =
    filterDropdown.querySelector(".selected").getAttribute("data-value") ||
    "all";
  const sortValue =
    sortDropdown.querySelector(".selected").getAttribute("data-value") ||
    "default";

  tasks.forEach((task) => {
    const isCompleted = task.getAttribute("data-completed") === "true";

    if (
      (filterValue === "completed" && !isCompleted) ||
      (filterValue === "incomplete" && isCompleted)
    ) {
      task.style.display = "none";
    } else {
      task.style.display = "flex";
    }
  });

  const visibleTasks = tasks.filter((task) => task.style.display !== "none");

  const priorities = { Low: 1, Medium: 2, High: 3 };

  visibleTasks.sort((a, b) => {
    const priorityA = priorities[a.getAttribute("data-priority")];
    const priorityB = priorities[b.getAttribute("data-priority")];

    if (sortValue === "low-high") {
      return priorityA - priorityB;
    } else if (sortValue === "high-low") {
      return priorityB - priorityA;
    } else {
      return 0;
    }
  });

  visibleTasks.forEach((task) => taskList.appendChild(task));
}

// Event listeners
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Custom dropdown control
document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
  const selected = dropdown.querySelector(".selected");
  const options = dropdown.querySelector(".options");

  selected.addEventListener("click", () => {
    dropdown.classList.toggle("open");
  });

  options.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerHTML = option.textContent + ' <div class="arrow"></div>';
      selected.setAttribute("data-value", option.getAttribute("data-value"));
      dropdown.classList.remove("open");

      applyFiltersAndSort();
    });
  });
});

// Closing if click outside
document.addEventListener("click", (e) => {
  document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });
});
