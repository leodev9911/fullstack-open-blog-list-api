const testingRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

testingRouter.get('/', async (request, response) => {
    try {
        response.send('Testing endpoint').end()
    } catch (error) {
        next(error)
    }
})

testingRouter.post('/reset', async (request, response) => {
    try {
        await Blog.deleteMany({})
        await User.deleteMany({})

        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = testingRouter