const router = require("express").Router();

const mail = require("../mail.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const MongoClient = require("mongodb").MongoClient;
const connectionUrl = "mongodb+srv://admin:admin@cluster0.ns182.mongodb.net/users?retryWrites=true&w=majority";

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) throw error;

    const users = client.db("users");
    const level_1 = users.collection("level_1");

    router.post("/register", (req, res) => {
        try {
            level_1.findOne({ userName: req.body.username }).then((user) => {
                if (user) return res.status(409).send("Username already exists");
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    level_1.insertOne({userName: req.body.username, password: hash, email: req.body.email}, (error, result) => {
                        if (error) throw new Error(error);
                        mail.sendMail();
                        return res.status(200).send(result);
                    });
                });
            });
        } catch (err) {
            console.log("Error occured: " + err);
        }
    });
});

module.exports = router;
