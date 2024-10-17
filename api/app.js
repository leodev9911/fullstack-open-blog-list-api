const express = require('express')
const app = express()
const cors = require('cors')
const { 
    handleError, 
    unknownEndpoint, 
} = require('./utils/middleware')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')

mongoose.set('strictQuery', false);

mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info('MongoDB connected'))
    .catch((error) => logger.error(error));

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Blog list api</h1>')
});

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(handleError);
app.use(unknownEndpoint);


module.exports = app;