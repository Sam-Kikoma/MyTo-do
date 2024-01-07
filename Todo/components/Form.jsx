const Form = ({ onSubmit, newTodo, onChange }) => {
	return (
		<form onSubmit={onSubmit}>
			<input type="text" placeholder="Enter todo" value={newTodo} onChange={onChange} />
			<button type="submit">+</button>
		</form>
	);
};

export default Form;
