const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog
            .find({})
            .populate('user', {
                name: 1,
                username: 1
            });
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
        const decodedToken = jwt.verify(req.token, process.env.SECRET);
        if (!decodedToken.id) {
            return res.status(401).send({ "error": "invalid token" });
        }
        const user = await User.findById(decodedToken.id);
            
        const blog = new Blog({
            ...req.body,
            user: user.id
        });

        const newEntry = await blog.save();
        user.blogs = user.blogs.concat(newEntry._id);
        user.save();

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
