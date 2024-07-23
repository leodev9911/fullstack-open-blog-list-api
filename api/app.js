const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');

mongoose.set('strictQuery', false);

mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info('MongoDB connected'))
    .catch((error) => logger.error(error));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Blog list api</h1>')
});

app.use('/api/blogs', blogsRouter);

app.use(middleware.handleError);
app.use(middleware.unknownEndpoint);


module.exports = app;