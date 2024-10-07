const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.find({});
        res.send(blogs);
    } catch (error) {
        next(error);
    }
});

blogsRouter.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        const blog = await Blog.findById(id);
        res.send(blog);
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

blogsRouter.put('/:id', async(req, res, next) => {
    try {
        const id = req.params.id;

        const updatedBlog = await Blog.findByIdAndUpdate(id, { likes: req.body.likes }, { new: true });
        res.send(updatedBlog);
    } catch (error) {
        next(error);
    }
});

blogsRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        await Blog.findByIdAndDelete(id);
        res.send(204).end();
    } catch (error) {
        next(error);
    }
}); 

module.exports = blogsRouter;
