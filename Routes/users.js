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

    router.get('/secret', async (req , res) => {
                try {
                    await jwt.verify(req.query.token, SECRET);
                } catch (e) {
                    return res.status(401).json({
                        title: 'Not Authenticated',
                        message: "Token couldn't be identified",
                    });
                }
                return res.sendFile(path.resolve("Views/secret.html"));
            });

    router.post('/login', (req, res) => {
        try {
            level_1.findOne({ userName: req.body.username }).then((user) => {
                if (!user) return res.status(400).send("Username doesn't exist");
                console.log(req.body.password + " : " + user.password);
                const validPass = bcrypt.compare(req.body.password, user.password);
                if (!validPass) return res.status(400).send('Invalid password');

                const token = jwt.sign({username: req.body.username}, SECRET);
                //res.send("<a href='http://localhost:8080/user?token=%s'></a>", token);
                return res.status('200').json([{ "http://localhost:8080/user?token=" : token }, { "http://localhost:8080/secret?token=" : token }]);
            });
        } catch (err) {
            console.log("Error occured: " + err);
        }
    });
});

module.exports = router;
