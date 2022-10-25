const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0j7e020.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("extensionApp").collection("user");

        // User API
        app.get('/user', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const query = {};
            const cursor = userCollection.find(query);
            let users;
            if(page || size){
                users = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                users = await cursor.toArray();
            }
            
            res.send(users);
        });

        app.get('/userCount', async(req, res) =>{
            // const query = {};
            // const cursor = userCollection.find(query);
            const count = await userCollection.estimatedDocumentCount();
            res.send({count});
        })


    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running My extension server');
});

app.listen(port, () => {
    console.log('CRUD Server is running');
})