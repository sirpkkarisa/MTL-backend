const express = require('express');
const bodyParser = require('body-parser');
// Database connection log
require('./middlewares/config-pool').pool;
// users relation
require('./models/users').usersTable();
require('./models/images').imagesTable();
require('./models/audios').audiosTable();
require('./models/videos').videosTable();
require('./models/comments').commentsTable();
require('./models/articles').articlesTable();

const app = express();
const usersRoutes = require('./routes/users');
const imagesRoutes = require('./routes/images');
const audiosRoutes = require('./routes/audios');
const videosRoutes = require('./routes/videos');
const articlesRoutes = require('./routes/articles');

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
app.use('/images', imagesRoutes);
app.use('/audios', audiosRoutes);
app.use('/videos', videosRoutes);
app.use('/articles', articlesRoutes);
module.exports = app;
