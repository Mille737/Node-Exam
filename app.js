const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const dbPath = 'mongodb://localhost/mandatory2';
const options = {useNewUrlParser: true, useUnifiedTopology: true}

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/Views/Level_1.html");
});

const MongoClient = require("mongodb").MongoClient;

const connectionUrl = "mongodb://localhost:27017";

MongoClient.connect(connectionUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) throw new Error(error);

    const users = client.db("users");

    const level_1 = users.collection("level_1");

    level_1.find().toArray((error, foundUsers) => {
        if (error) throw new Error(error);

        console.log(foundUsers);

        app.set('view engine', 'ejs');

        app.get('/users',(req , res) =>{
            level_1.find().toArray(function(err , i){
                if (err) return console.log(err)

                res.render('index.ejs',{foundUsers: i})
            })
        });
    });
});

const port = process.env.PORT || 8080;

app.listen(port, (error) => {
    if (error) {
        console.log("Server couldn't start :( ", error);
    }
    console.log("Server started on port", Number(port));
});
