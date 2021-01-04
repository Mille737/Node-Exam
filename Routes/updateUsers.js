const router = require('express').Router();

const MongoClient = require("mongodb").MongoClient;
const connectionUrl = "mongodb://localhost:27017";

const bcrypt = require("bcrypt");
const saltRounds = 10;

MongoClient.connect(connectionUrl, { useUnifiedTopology: true },function(err, client) {
    if (err) throw err;
    const users = client.db("users");
    const level_1 = users.collection("level_1");

    router.put("/updated", (req, res) => {
        try {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                const newValues = {$set: {userName: req.body.username, password: hash, email: req.body.email}};
                level_1.updateOne({userName: req.body.oldUsername}, newValues, function (err, success) {
                    if (err) throw err;
                    console.log(JSON.stringify(success.result));
                    return res.send(success).status(200);
                });
            });
        } catch (err) {
            console.log("Error occured: " + err);
        }
    });
});

module.exports = router;
