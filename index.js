const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//? middle were
app.use(cors());
app.use(express.json());

//? Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-01.x4mie.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//? Server Stablish
async function run() {
  try {
      await client.connect();

      const inventoryCollection = client.db('mobilewarehouse').collection('items');

      //? get all inventory item
      app.get('/inventory', async (req, res) => {
          const query = {};
          const cursor = inventoryCollection.find(query);
          const inventories = await cursor.toArray();
          res.send(inventories);
      });



      //? get inventory item by id
      app.get('/inventory/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const inventory = await inventoryCollection.findOne(query);
          res.send(inventory);
      })


      //? add inventory item
      app.post('/additem', async (req, res) => {
        const newitem = req.body;
        const result = await inventoryCollection.insertOne(newitem);
        res.send(result);
    });



    //? delete an inventory item
    app.delete('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id)};
      const inventory = await inventoryCollection.deleteOne(query);
      res.send(inventory);
  });



  //? update stock of inventory ite
  app.put('/inventory/:id', async (req, res) => {
    const id = req.params.id;
    const quantity = req.body.quantity;
    const filter = {_id: ObjectId(id)};
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            quantity: quantity,}
    };
    const result = await inventoryCollection.updateOne(filter, updatedDoc, options);
    res.send(result)
})
     


  }
  finally {
      //// client.close();
  }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server site')
  });
app.get('/server', (req, res) => {
    res.send('test')
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });