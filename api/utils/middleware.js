const logger = require('./logger')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (req, res) => {
    res.status(404).send({ "error": "Unknown Endpoint" })
}

const handleError = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }

    next(error);
}

const tokenExtractor = (req, res, next) => {
    const auth = req.get('authorization')

    if (auth && auth.startsWith('Bearer ')) {
        req.token = auth.replace('Bearer ', '')
    };

    next();
}

const userExtractor = (req, res, next) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    req.user = decodedToken
    next()
}

module.exports = {
    unknownEndpoint,
    handleError,
    tokenExtractor,
    userExtractor
}