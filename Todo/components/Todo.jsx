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

export default Todo;
