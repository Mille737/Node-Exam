const MongoClient = require("mongodb").MongoClient;

const connectionUrl = "mongodb://localhost:27017";

MongoClient.connect(connectionUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) throw new Error(error);

    const users = client.db("users.js");

    const level_1 = users.collection("level_1");

    level_1.insertMany([{userName: "Ron", password: "pass4"}], (error, result) => {
        if (error) throw new Error(error);

        console.log(result);
        client.close();
    });
    
});
