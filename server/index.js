const express = require("express");
const databaseConnection = require("./database");
const taskRouter = require("./routes/task.router");
const cors = require("cors");
const authMiddleware = require("./middleware/auth.middleware");
const labelRouter = require("./routes/label.router");
const userRouter = require("./routes/user.router")

// database connection
databaseConnection();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/",(req, res)=> {
    res.send("Hello from server");
});

app.use("/tasks", authMiddleware, taskRouter);
app.use("/labels", authMiddleware, labelRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});