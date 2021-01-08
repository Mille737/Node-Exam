const router = require('express').Router();

const MongoClient = require("mongodb").MongoClient;
const connectionUrl = "mongodb+srv://admin:admin@cluster0.ns182.mongodb.net/users?retryWrites=true&w=majority";

const bcrypt = require("bcrypt");
const saltRounds = 10;

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) throw error;
    const users = client.db("users");
    const level_1 = users.collection("level_1");

    router.put("/updated", (req, res) => {
        try {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                const newValues = {$set: {userName: req.body.username, password: hash, email: req.body.email}};
                level_1.updateOne({userName: req.body.oldUsername}, newValues, function (err, success) {
                    if (err) throw err;
                    return res.send(success).status(200);
                });
            });
        } catch (err) {
            console.log("Error occured: " + err);
        }
    });
});

module.exports = router;
