require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/data', express.static('data'));

app.get('/mapbox-api-key', (req, res) => {
  res.send({ key: process.env.MAPBOX_API });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});