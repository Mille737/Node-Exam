const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per windowMs
});
app.use(limiter);

app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/Views/home.html");
});
app.get("/register", (req, res) => {
    return res.sendFile(__dirname + "/Views/register.html");
});
app.get("/confirmation", (req, res) => {
    return res.sendFile(__dirname + "/Views/confirmation.html");
});
app.get("/update", (req, res) => {
    return res.sendFile(__dirname + "/Views/update.html");
});

const usersRoutes = require("./Routes/users.js");
const createUserRoutes = require("./Routes/createUsers.js");
const updateUserRoutes = require("./Routes/updateUsers.js");
const deleteUserRoutes = require("./Routes/deleteUser.js");
app.use(usersRoutes);
app.use(createUserRoutes);
app.use(updateUserRoutes);
app.use(deleteUserRoutes);

const port = process.env.PORT || 8080;

app.listen(port, (error) => {
    if (error) {
        console.log("Server couldn't start :( ", error);
    }
    console.log("Server started on port", Number(port));
});
