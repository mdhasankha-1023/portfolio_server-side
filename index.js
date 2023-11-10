const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000

// middleware
app.use(cors())


// first gating
app.get('/', (req, res) => {
    res.send('This is my portfolio server!!')
})

// this is listing
app.listen(port, () => {
    console.log(`This is my portfolio server on Port: ${port}`);
})