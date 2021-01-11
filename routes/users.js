const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const MongoClient = require("mongodb").MongoClient;
const connectionUrl = "mongodb+srv://admin:admin@cluster0.ns182.mongodb.net/users?retryWrites=true&w=majority";

const SECRET = 'THISISASECRET';

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) throw error;

    const users = client.db("users");
    const level_1 = users.collection("level_1");

    level_1.find().toArray((error, foundUsers) => {
        if (error) throw new Error(error);
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
                res.render('level_1.ejs', {foundUsers: i});
            })
        });
    });

    router.post('/login', (req, res) => {
        try {
            level_1.findOne({ userName: req.body.username }).then((user) => {
                if (!user) return res.status(400).send("Username does not exists");
                bcrypt.compare(req.body.password, user.password, (error, data) => {
                    if (error) throw error;
                    if (data) {
                        const token = jwt.sign({username: req.body.username}, SECRET);
                        return res.status(200).send(token);
                    } else {
                        return res.status(401).send("Invalid password");
                    }
                });
            });
        } catch (error) {
            console.log("Error occured: " + error);
        }
    });
});

module.exports = router;
