const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cors({credentials: true, origin: true, exposedHeaders: '*'}));
app.use(function(req, res, next) {
    res.header('Acces-Control-Allow-Origin', '*');
    res.header('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Acces-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/Views/home.html");
});

const usersRoutes = require("./Routes/users.js");
app.use(usersRoutes);

const port = process.env.PORT || 8080;

app.listen(port, (error) => {
    if (error) {
        console.log("Server couldn't start :( ", error);
    }
    console.log("Server started on port", Number(port));
});
