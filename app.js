const express = require('express');
const bodyParser = require('body-parser');
// Database connection log
require('./models/users').pool;
//users relation
require('./models/users').usersTable();
const app = express();
const usersRoutes = require('./routes/users');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(bodyParser({limit: 100mb,}))
app.use('/auth', usersRoutes);
module.exports = app;
