const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
// middleware
app.use(cors())
app.use(express.json())
// user:ajoy
// pass:FMxAwIGN2FAoo7BI
// mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmip1b8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    try {
        const taskCollection = client.db('task').collection('added-task');
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // added task
        app.post('/add-task', async (req, res) => {
            const data = req.body;
            const result = await taskCollection.insertOne(data);
            res.send(result)
        })

        // get all task from database
        app.get('/all-task', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result)
        })
        // update status
        app.put('/add-task/:id', async(req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateTask = req.body;
            console.log(updateTask)
            const updateDoc = {
                $set: {
                    status: updateTask.status,
                   
                }
            }
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        // delete task
        app.delete('/add-task/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:new ObjectId(id)};
            const result=await taskCollection.deleteOne(query);
            res.send(result)
          })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})