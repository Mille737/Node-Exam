const router = require("express").Router();
const path = require("path");
const mail = require("../mail.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const MongoClient = require("mongodb").MongoClient;
const connectionUrl = "mongodb://localhost:27017"

MongoClient.connect(connectionUrl, {useUnifiedTopology: true}, (error, client) => {
    if (error) throw new Error(error);

    const users = client.db("users");
    const level_1 = users.collection("level_1");

    router.post("/confirmation", (req, res) => {
        try {
            level_1.findOne({ userName: req.body.username }).then((user) => {
                if (user) return res.status(409).send("Username already exist");
                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    level_1.insertOne({userName: req.body.username, password: hash}, (error, result) => {
                        if (error) throw new Error(error);
                        mail.sendMail();
                        console.log(result);
                        return res.sendFile(path.resolve("Views/confirmation.html"));
                    });
                });
            });
        } catch (err) {
            console.log("Error occured: " + err);
        }
    });
});

module.exports = router;
