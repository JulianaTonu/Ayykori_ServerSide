const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb'); // Import ObjectId

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qdgqirr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const candidatesCollection = client.db('candidatesDB').collection('candidates');

    app.get('/candidates', async (req, res) => {
      const cursor = candidatesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Change type
    app.put('/candidates/type/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const filter = { _id:new ObjectId(id) }; // Use ObjectId to construct filter
      const updateDoc = {
        $set: {
          type: 'shortlisted'
        }
      };

    //reject
    app.put('/candidates/reject/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const filter = { _id:new ObjectId(id) }; // Use ObjectId to construct filter
      const updateDoc = {
        $set: {
          reject: 'rejected'
        }
      };

      try {
        const result = await candidatesCollection.updateOne(filter, updateDoc);
        if (result.modifiedCount > 0) {
          res.status(200).json({ success: true, message: 'Candidate type updated successfully' });
        } else {
          res.status(404).json({ success: false, message: 'Candidate not found' });
        }
      } catch (error) {
        console.error('Error updating candidate type:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensure the client closes when finished/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Ayykori server is running');
});

app.listen(port, () => {
  console.log(`Ayykori Server is running on port: ${port}`);
});
