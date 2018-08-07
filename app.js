const serverless = require('serverless-http');
const express = require('express')
const app = express();

const { mongoURL } = require('./keys');
const MongoClient = require('mongodb').MongoClient;


const User = MongoClient.connect(mongoURL, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
});

app.get('/', function(req, res) {


    User.then(db => {
            const dbo = db.db("mydb");
            dbo.collection("customers").findOne({})
                .then(result => {
                    console.log(result);
                    return res.status(200).json({
                        ok: true,
                        result
                    })
                }).catch(err => {
                    console.log(err);
                })
        })
        .catch(err => console.log(err))


})

module.exports.handler = serverless(app);