const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;
console.log(`Connecting to url`);

mongoose
	.connect(url)

	.then((result) => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const todoSchema = new mongoose.Schema({
	task: {
		type: String,
		required: true,
	},
	creationDate: {
		type: Date,
		required: true,
	},
	completed: {
		type: Boolean,
		required: true,
	},
});

todoSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Todo", todoSchema);
