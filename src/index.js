require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const auth_router = require("./routes/auth/auth");
const user_router = require("./routes/user/user");
const todos_router = require("./routes/todos/todos");

app.use(auth_router);
app.use('/user', user_router);
app.use('/todo', todos_router);

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});