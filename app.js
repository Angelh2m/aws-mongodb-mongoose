const serverless = require('serverless-http');
const express = require('express')
const app = express();

const { mongoURL } = require('./keys');
const { schema } = require('./schemas');
const MongoClient = require('mongodb').MongoClient;


const User = MongoClient.connect(mongoURL, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
});


app.use(express.urlencoded({ extended: true }));

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

app.post('/', (req, res) => {


    schema.name = 'Nana';


    return res.status(200).json({
        ok: true,
        schema
    })



    // User.then(db => {
    //         const dbo = db.db("mydb");
    //         const myobj = {
    //             name: ' Hello You',
    //             lastName: ' A fried '
    //         }

    //         // dbo.collection("customers").insertOne(myobj)
    //         //     .then(() => {
    //         //         return res.status(200).json({
    //         //             ok: true,
    //         //             myobj
    //         //         })
    //         //     }).catch(e => e);
    //     })
    //     .catch(err => console.log(err))

})

module.exports.handler = serverless(app);

const port = process.env.PORT || 6000;
app.listen(port, () => {
    console.log('Server Running');
});