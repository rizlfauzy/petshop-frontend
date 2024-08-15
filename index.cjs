const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { VITE_PORT, VITE_FRONTEND } = process.env;
const app = express();
const http = require("http").createServer(app);

app.use(cors());

app.use(express.static("dist"));

app.get(`*`, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

http.listen(VITE_PORT, () => {
  console.log(`Server running on port ${VITE_PORT} on ${VITE_FRONTEND}`);
});
