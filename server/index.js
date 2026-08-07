const express = require("express");
const databaseConnection = require("./database");
const taskRouter = require("./routes/task.router");
const cors = require("cors");

// database connection
databaseConnection();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/",(req, res)=> {
    res.send("Hello from server");
});

app.use("/tasks", taskRouter);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});