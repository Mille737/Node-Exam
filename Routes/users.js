const router = require('express').Router();

const MongoClient = require("mongodb").MongoClient;

const connectionUrl = "mongodb://localhost:27017";

MongoClient.connect(connectionUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) throw new Error(error);

    const users = client.db("users");

    const level_1 = users.collection("level_1");

    level_1.find().toArray((error, foundUsers) => {
        if (error) throw new Error(error);

        console.log(foundUsers);

        router.get('/users',(req , res) =>{
            level_1.find().toArray(function(err , i){
                if (err) return console.log(err)

                res.render('Level_1.ejs',{foundUsers: i})
            })
        });
    });
});

module.exports = router;
