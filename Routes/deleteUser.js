const router = require('express').Router();

const MongoClient = require("mongodb").MongoClient;
const connectionUrl = "mongodb+srv://admin:admin@cluster0.ns182.mongodb.net/users?retryWrites=true&w=majority";

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) throw error;
    const users = client.db("users");
    const level_1 = users.collection("level_1");
    router.delete("/delete", (req, res) => {
        try {
            level_1.deleteOne({userName: req.body.username}, function (error, success) {
                if (error) throw error;
                return res.status(200).send(success);
            });
        } catch (err) {
            console.log("Error occured: " + err);
        }
    });
});

module.exports = router;
