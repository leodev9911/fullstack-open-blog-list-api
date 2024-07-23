const logger = require('./logger');

const unknownEndpoint = (req, res) => {
    res.status(404).send({ "error": "Unknown Endpoint" });
}

const handleError = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    }

    next(error);
} 

module.exports = {
    unknownEndpoint, 
    handleError
}