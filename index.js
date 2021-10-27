const express = require("express")
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;

//
//

app.get('/', (req, res) => {
  res.send("Hitting server expert mechanic")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xfro9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect()
    const database = client.db("expert-mechanic");
    const serviceCollection = database.collection('services')

    //add service
    app.post('/services', async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService)
      console.log(result)
      res.json(result)
    })

    //get all service
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({})
      const result = await cursor.toArray()
      res.send(result)
    })

    //delete service

    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await serviceCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await serviceCollection.findOne(query)
      res.send(result)
      console.log(result)
    })

    app.put('/services/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: ObjectId(id) }
      const changedService = req.body
      const options = { upsert: true };
      console.log('inside put')
      const updateService = {
        $set: {
          title: changedService.title,
          price: changedService.price,
          img: changedService.img,
          desc: changedService.desc
        },
      };
      const result = await serviceCollection.updateOne(filter, updateService, options)
      res.send(result)
      console.log(result)
    })

  } finally {

  }
}

run().catch(console.dir)

app.listen(port, (req, res) => {
  console.log('I am listening port no: ', port)
})