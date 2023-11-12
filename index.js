const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport')
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// mailgun setup
const auth = {
    auth: {
      api_key: `${process.env.MG_API_KEY}`,
      domain: `${process.env.MG_DOMAIN}`
    }
  }

  
const transport = nodemailer.createTransport(mg(auth));


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

    // Email
    app.post('/email', (req, res) => {
      const mailInfo = req.body;
      const {email, message, name, subject} = mailInfo;
      // console.log(email, message, name, subject)

      transport.sendMail({
          from: `${email}`,
          to: 'mdhasankha.wd@gmail.com',
          subject: `${subject}`,
          html: `
        <h1 style={text-align: center}>${subject}</h1>
          <p>${message}</p>
          `
      }, (err, info) => {
          if (err) {
              console.log(`Error: ${err}`);
          }
          else {
              res.send(info);
          }
      });
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