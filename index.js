const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport')
const cors = require('cors');
const port = process.env.PORT || 5000

// middleware
app.use(cors())

// mailgun setup
const auth = {
    auth: {
      api_key: '6d8d428c-d11cf93b',
      domain: 'sandbox6d236b137a78458099e9181053cdb718.mailgun.org'
    }
  }


// mongodb start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kgqmoa1.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Collection
    const allProjects = client.db('Portfolio-data').collection('projects_info')


    // Get all projects
    app.get('/allProjects',  async(req, res) => {
        const result = await allProjects.find().toArray();
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);





// first gating
app.get('/', (req, res) => {
    res.send('This is my portfolio server!!')
})

// this is listing
app.listen(port, () => {
    console.log(`This is my portfolio server on Port: ${port}`);
})