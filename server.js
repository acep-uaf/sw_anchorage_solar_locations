require('dotenv').config();
const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/code/:filename', (req, res) => {
  const filename = req.params.filename;
  fs.readFile(path.join(__dirname, '/code/', filename), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send(`An error occurred while reading ${filename}`);
    }
    const replacedData = data.replace('MAPBOX_API', process.env.MAPBOX_API);
    res.setHeader('Content-Type', 'application/javascript');
    res.send(replacedData);
  });
});

app.use(express.static(path.join(__dirname, '/')));

// Catch-all route handler
app.get('*', (req, res) => {
  res.status(404).send(`Cannot find ${req.originalUrl} on this server!`);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
