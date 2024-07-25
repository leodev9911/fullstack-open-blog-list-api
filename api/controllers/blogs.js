const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger');

blogsRouter.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.find({});
        res.send(blogs);
    } catch (error) {
        next(error);
    }
});

blogsRouter.post('/', async (req, res, next) => {
    try {
        const blog = new Blog(req.body);
        const newEntry = await blog.save();

        res.status(201).send(newEntry).end();
    } catch (error) {
        next(error)
    }
});

module.exports = blogsRouter;
