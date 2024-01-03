const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Todo = require("./models/todo");

app.use(cors());
app.use(express.json());
// Routes
app.get("/", (req, res) => {
	res.send(`<h1>Hello</h1>`);
});
// Fetch all todos
app.get("/api/todos", (req, res) => {
	Todo.find().then((todos) => res.json(todos));
});
// Fetch a single todo
app.get("/api/todos/:id", (req, res) => {
	Todo.findById(req.params.id).then((todo) => res.json(todo));
});
// Add a todo
app.post("/api/todos", (req, res) => {
	const body = req.body;
	const creationDate = new Date(body.creationDate);
	const todo = new Todo({
		task: body.task,
		creationDate: body.creationDate,
		completed: body.completed,
	});
	todo.save().then((savedTodo) => res.json(savedTodo));
});
// Delete a todo
app.delete("/api/todos/:id", (req, res) => {
	Todo.findOneAndDelete({ _id: req.params.id }).then((result) => {
		if (result) {
			res.status(204).end();
		} else {
			res.status(404).json({ error: "Todo not found" });
		}
	});
});

// Port
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`She lives ${PORT}`);
});
