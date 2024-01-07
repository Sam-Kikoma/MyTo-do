import { useState, useEffect } from "react";
import axios from "axios";
const baseUrl = "http://localhost:3001/api/todos";
import "./App.css";

const Todo = ({ todos, onChange, deleteTodo }) => {
	return (
		<>
			<ul>
				{todos.map((todo) => (
					<li key={todo.id}>
						{todo.completed ? (
							<span style={{ textDecoration: "line-through" }}>{todo.task}</span>
						) : (
							<span>{todo.task}</span>
						)}
						<input
							type="checkbox"
							name="completed"
							id={`completed-${todo.id}`}
							checked={todo.completed}
							onChange={() => onChange(todo.id)}
						/>
						<button onClick={() => deleteTodo(todo.id)}>Delete</button>
					</li>
				))}
			</ul>
		</>
	);
};

const Form = ({ onSubmit, newTodo, onChange }) => {
	return (
		<form onSubmit={onSubmit}>
			<input type="text" placeholder="Enter todo" value={newTodo} onChange={onChange} />
			<button type="submit">+</button>
		</form>
	);
};
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
		<>
			<h1>Todo App</h1>
			<Form newTodo={newTodo} onSubmit={addTodo} onChange={handleChange} />
			<h2>Todos</h2>
			<Todo todos={todos} onChange={handleChecked} deleteTodo={deleteTodo} />
		</>
	);
};

export default App;
