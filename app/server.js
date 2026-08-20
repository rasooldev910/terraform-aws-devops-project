const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Build Docker Image",
    completed: true
  },
  {
    id: 2,
    title: "Push Image to ECR",
    completed: true
  },
  {
    id: 3,
    title: "Deploy Application to EKS",
    completed: true
  },
  {
    id: 4,
    title: "Configure Argo CD",
    completed: false
  },
  {
    id: 5,
    title: "Configure CI/CD Pipeline",
    completed: false
  }
];

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>DevOps Task Tracker</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }

    body {
      background: #f4f7fb;
      color: #1f2937;
    }

    header {
      background: #172554;
      color: white;
      padding: 25px;
      text-align: center;
    }

    header h1 {
      font-size: 30px;
      margin-bottom: 8px;
    }

    header p {
      color: #cbd5e1;
    }

    .container {
      max-width: 1000px;
      margin: 30px auto;
      padding: 0 20px;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
      text-align: center;
    }

    .card h2 {
      font-size: 32px;
      margin-top: 8px;
    }

    .total h2 {
      color: #2563eb;
    }

    .completed h2 {
      color: #16a34a;
    }

    .pending h2 {
      color: #ea580c;
    }

    .add-task {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
      margin-bottom: 25px;
    }

    .add-task h2 {
      margin-bottom: 15px;
    }

    .input-row {
      display: flex;
      gap: 10px;
    }

    input {
      flex: 1;
      padding: 13px;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      font-size: 16px;
    }

    button {
      border: none;
      border-radius: 7px;
      padding: 12px 18px;
      cursor: pointer;
      font-size: 15px;
    }

    .add-btn {
      background: #2563eb;
      color: white;
    }

    .add-btn:hover {
      background: #1d4ed8;
    }

    .tasks {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    }

    .tasks h2 {
      margin-bottom: 20px;
    }

    .task {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      border-bottom: 1px solid #e5e7eb;
      gap: 10px;
    }

    .task:last-child {
      border-bottom: none;
    }

    .task-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .task-title.completed {
      text-decoration: line-through;
      color: #64748b;
    }

    .status {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
    }

    .status.completed {
      background: #dcfce7;
      color: #166534;
    }

    .status.pending {
      background: #ffedd5;
      color: #9a3412;
    }

    .delete-btn {
      background: #fee2e2;
      color: #b91c1c;
    }

    .complete-btn {
      background: #dcfce7;
      color: #166534;
      margin-right: 5px;
    }

    .empty {
      text-align: center;
      padding: 30px;
      color: #64748b;
    }

    footer {
      text-align: center;
      padding: 30px;
      color: #64748b;
    }

    @media (max-width: 700px) {
      .cards {
        grid-template-columns: 1fr;
      }

      .input-row {
        flex-direction: column;
      }

      .task {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  </style>
</head>

<body>

  <header>
    <h1>🚀 DevOps Task Tracker</h1>
    <p>Node.js • Docker • Kubernetes • EKS • Argo CD</p>
  </header>

  <div class="container">

    <div class="cards">

      <div class="card total">
        <p>Total Tasks</p>
        <h2 id="total">0</h2>
      </div>

      <div class="card completed">
        <p>Completed</p>
        <h2 id="completed">0</h2>
      </div>

      <div class="card pending">
        <p>Pending</p>
        <h2 id="pending">0</h2>
      </div>

    </div>

    <div class="add-task">

      <h2>➕ Add New Task</h2>

      <div class="input-row">

        <input
          id="taskInput"
          type="text"
          placeholder="Enter a task..."
        >

        <button
          class="add-btn"
          onclick="addTask()"
        >
          Add Task
        </button>

      </div>

    </div>

    <div class="tasks">

      <h2>📋 Your Tasks</h2>

      <div id="taskList"></div>

    </div>

  </div>

  <footer>
    DevOps Task Tracker | Deployed with Kubernetes 🚀
  </footer>

  <script>

    async function loadTasks() {

      const response = await fetch("/api/tasks");

      const tasks = await response.json();

      const total = tasks.length;

      const completed =
        tasks.filter(function(task) {
          return task.completed;
        }).length;

      const pending = total - completed;

      document.getElementById("total").textContent = total;

      document.getElementById("completed").textContent =
        completed;

      document.getElementById("pending").textContent =
        pending;

      const taskList =
        document.getElementById("taskList");

      if (tasks.length === 0) {

        taskList.innerHTML =
          '<div class="empty">No tasks yet. Add your first task!</div>';

        return;
      }

      taskList.innerHTML = tasks.map(function(task) {

        const statusText =
          task.completed ? "Completed" : "Pending";

        const statusClass =
          task.completed ? "completed" : "pending";

        const titleClass =
          task.completed ? "completed" : "";

        const completeButton =
          task.completed
            ? ""
            : '<button class="complete-btn" onclick="completeTask(' +
              task.id +
              ')">Complete</button>';

        return (
          '<div class="task">' +

            '<div class="task-left">' +

              '<span>' +
                (task.completed ? "✅" : "⬜") +
              '</span>' +

              '<span class="task-title ' +
                titleClass +
              '">' +
                task.title +
              '</span>' +

              '<span class="status ' +
                statusClass +
              '">' +
                statusText +
              '</span>' +

            '</div>' +

            '<div>' +

              completeButton +

              '<button ' +
                'class="delete-btn" ' +
                'onclick="deleteTask(' +
                  task.id +
                ')">' +
                'Delete' +
              '</button>' +

            '</div>' +

          '</div>'
        );

      }).join("");

    }


    async function addTask() {

      const input =
        document.getElementById("taskInput");

      const title =
        input.value.trim();

      if (!title) {

        alert("Please enter a task.");

        return;
      }

      await fetch("/api/tasks", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          title: title
        })

      });

      input.value = "";

      loadTasks();

    }


    async function completeTask(id) {

      await fetch(
        "/api/tasks/" + id,
        {
          method: "PUT"
        }
      );

      loadTasks();

    }


    async function deleteTask(id) {

      await fetch(
        "/api/tasks/" + id,
        {
          method: "DELETE"
        }
      );

      loadTasks();

    }


    loadTasks();

  </script>

</body>

</html>
  `);
});


// Get all tasks
app.get("/api/tasks", (req, res) => {

  res.json(tasks);

});


// Add a task
app.post("/api/tasks", (req, res) => {

  const { title } = req.body;

  if (!title) {

    return res.status(400).json({
      error: "Task title is required"
    });

  }

  const task = {

    id: Date.now(),

    title: title,

    completed: false

  };

  tasks.push(task);

  res.status(201).json(task);

});


// Complete a task
app.put("/api/tasks/:id", (req, res) => {

  const id = Number(req.params.id);

  const task =
    tasks.find(function (task) {
      return task.id === id;
    });

  if (!task) {

    return res.status(404).json({
      error: "Task not found"
    });

  }

  task.completed = true;

  res.json(task);

});


// Delete a task
app.delete("/api/tasks/:id", (req, res) => {

  const id = Number(req.params.id);

  tasks =
    tasks.filter(function (task) {
      return task.id !== id;
    });

  res.json({
    message: "Task deleted successfully"
  });

});


// Health check
app.get("/health", (req, res) => {

  res.status(200).json({

    status: "healthy",

    application: "devops-task-tracker",

    version: "2.0.0"

  });

});


app.listen(PORT, () => {

  console.log(
    `DevOps Task Tracker running on port ${PORT}`
  );

});