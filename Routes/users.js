const router = require('express').Router();
const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const MongoClient = require("mongodb").MongoClient;
const connectionUrl = "mongodb://localhost:27017";

const SECRET = 'THISISASECRET';

MongoClient.connect(connectionUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) throw new Error(error);

    const users = client.db("users");
    const level_1 = users.collection("level_1");

    level_1.find().toArray((error, foundUsers) => {
        if (error) throw new Error(error);

        console.log(foundUsers);

        router.get('/users', async (req , res) => {
            try {
                await jwt.verify(req.query.token, SECRET);
            } catch (e) {
                return res.status(401).json({
                    title: 'Not Authenticated',
                    message: "Token couldn't be identified",
                });
            }

            level_1.find().toArray(function(err , i) {
                if (err) return console.log(err);
                res.render('Level_1.ejs', {foundUsers: i});
            })
        });
    });

    router.post('/login', (req, res) => {
        try {
            level_1.findOne({ userName: req.body.username }).then((user) => {
                if (!user) return res.status(400).send("User not exist");
                bcrypt.compare(req.body.password, user.password, (err, data) => {
                    if (err) throw err;
                    if (data) {
                        const token = jwt.sign({username: req.body.username}, SECRET);
                        return res.status('200').json([{ "http://localhost:8080/users?token=" : token }]);
                    } else {
                        return res.status(401).send("Invalid password");
                    }
                });
            });
        } catch (err) {
            console.log("Error occured: " + err);
        }
    });
});

module.exports = router;
