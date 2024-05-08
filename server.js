require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/')));

app.get('/mapbox-api-key', (req, res) => {
  res.send({ key: process.env.MAPBOX_API });
});

// Catch-all route handler
app.get('*', (req, res) => {
  res.send(`Cannot find ${req.originalUrl} on this server!`, 404);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});