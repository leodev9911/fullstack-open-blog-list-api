const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger');

blogsRouter.get('/', (req, res) => {
    Blog
        .find({})
        .then(blogs => res.send(blogs))
        .catch(error => logger.error(error));
});

blogsRouter.post('/', (req, res) => {
    const blog = new Blog(req.body);

    blog
        .save()
        .then(result => {
            res.status(201).send(result).end();
        })
        .catch(error => logger.error(error));
});

module.exports = blogsRouter;