const http = require('https');
const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');


app.use(cors());
var whitelist = ['http://localhost:8080', 'http://localhost:3000']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
const authRoutes = require("./Routes/AuthRoutes/authRoutes");
app.use('/api/auth', cors(corsOptionsDelegate), authRoutes);



module.exports = app;