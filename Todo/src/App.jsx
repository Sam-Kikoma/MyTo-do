import { useState, useEffect } from "react";
import axios from "axios";
const baseUrl = "http://localhost:3001/api/todos";
import Form from "/components/Form.jsx";
import Todo from "/components/Todo.jsx";
import "./index.css";

const App = () => {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState();
	// Handle change on input
	const handleChange = (event) => {
		setNewTodo(event.target.value);
	};
	// Handle checkbox change
	const handleChecked = (todoId) => {
		const updatedTodo = todos.find((todo) => todo.id === todoId);

		// Optimistically update the UI
		setTodos((prevTodos) =>
			prevTodos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo))
		);

		// Send a PUT request to update the completed status on the server
		axios
			.put(`${baseUrl}/${todoId}`, { completed: !updatedTodo.completed })
			.then((res) => {
				// Optional: You can handle success if needed
				console.log("Todo item updated on the server:", res.data);
			})
			.catch((error) => {
				// Revert the UI to the previous state if the PUT request fails
				setTodos((prevTodos) =>
					prevTodos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo))
				);

				// Optional: You can handle the error if needed
				console.error("Error updating todo item on the server:", error);
			});
	};

	// Deleting a todo
	const deleteTodo = (todoId) => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			axios.delete(`${baseUrl}/${todoId}`).then(() => {
				setTodos(todos.filter((todo) => todo.id !== todoId));
			});
		}
	};

	// Fetching from API(Get)
	const hook = () => {
		axios.get(baseUrl).then((res) => {
			setTodos(res.data);
		});
	};
	// Create todo
	const addTodo = (event) => {
		event.preventDefault();
		const date = new Date();
		const todoObj = {
			task: newTodo,
			creationDate: date,
			completed: false,
		};
		// Post
		const pushTodo = () => {
			axios.post(baseUrl, todoObj).then((res) => {
				setTodos(todos.concat(res.data));
				setNewTodo("");
			});
		};
		pushTodo();
	};
	useEffect(hook, []);

	return (
		<div className="w-screen flex flex-col justify-center items-center">
			<h1>Todo App</h1>
			<Form newTodo={newTodo} onSubmit={addTodo} onChange={handleChange} />
			<Todo todos={todos} onChange={handleChecked} deleteTodo={deleteTodo} />
		</div>
	);
};

export default App;
