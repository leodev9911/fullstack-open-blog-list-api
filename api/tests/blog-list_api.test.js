const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')
const helper = require('../utils/list_helper')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Top 5 preguntas de JavaScript en Stack Overflow',
        author: 'Miguel Angel Durán García',
        url: 'https://midu.dev/top-5-preguntas-javascript-stack-overflow/',
        likes: 0,
        user: '67055b3e9f59a741eb654293'
    },
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        user: '67055b3e9f59a741eb654293',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        user: '67055b3e9f59a741eb654293',
        likes: 5,
    },
]

describe('testing the blog-list api when there are no initial data', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})

        await Blog.insertMany(initialBlogs)
    })

    test('/api/blogs returns a status code of 200 and there are in JSON format', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-type', /application\/json/)
    })

    test('/api/blogs returns 3 blogs', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(
            response.body.length,
            initialBlogs.length,
            'Should be equal'
        )
    })

    test('the unique identifier of a blog posts is named id', async () => {
        const response = await api.get('/api/blogs')

        const keyArrays = Object.keys(response.body[0])
        assert.strictEqual(
            keyArrays.includes('id'),
            true,
            'The blog post must include a key named id as unique identifier'
        )
    })
})

let token

describe('login', () => {
    test('makin a POST request to /api/login must return a token', async () => {
        const user = {
            username: 'mluukkai2',
            password: 'salainen',
        }

        await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .end(res => {
                token = res.body.token
            })
    })
})

describe('addition of a new note', () => {
    test('making a POST request to /api/blogs create a new entry', async () => {
        const newPost = {
            title: 'toReversed, toSpliced, toSorted y with. Nuevos métodos de Array en JavaScript explicados.',
            author: 'Miguel Angel Durán García',
            url: 'https://midu.dev/to-reversed-to-spliced-to-sorted-with/',
            likes: 0,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newPost)
            .expect(201)

        const response = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)
        assert.strictEqual(response.body.length, initialBlogs.length + 1)
        assert.strictEqual(titles.includes(newPost.title), true)
    })

    test('making a POST request without likes will create a new blog entry with likes: 0', async () => {
        const newPost = {
            title: 'toReversed, toSpliced, toSorted y with. Nuevos métodos de Array en JavaScript explicados.',
            author: 'Miguel Angel Durán García',
            url: 'https://midu.dev/to-reversed-to-spliced-to-sorted-with/'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newPost)
            .expect(201)

        assert.strictEqual(response.body.likes, 0)
    })

    test('making a POST request without title will respond with a 400 status code', async () => {
        const newPost = {
            author: 'Miguel Angel Durán García',
            url: 'https://midu.dev/to-reversed-to-spliced-to-sorted-with/'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newPost)
            .expect(400)
    })

    test('making a POST request without url will respond with a 400 status code', async () => {
        const newPost = {
            title: 'toReversed, toSpliced, toSorted y with. Nuevos métodos de Array en JavaScript explicados.',
            author: 'Miguel Angel Durán García',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newPost)
            .expect(400)
    })
})

describe('deletion of a blog', () => {
    test('if success return 204 status', async () => {
        const responseAtStart = await api.get('/api/blogs')
        const blogToDelete = responseAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const responseAtEnd = await api.get('/api/blogs')
        const titles = responseAtEnd.body.map(r => r.title)
        assert.strictEqual(titles.includes(blogToDelete.title), false)
    })
})

describe('update of the likes of the blog', () => {
    test('if success return 200 status', async () => {
        const responseAtStart = await api.get('/api/blogs')
        const blogToUpdate = responseAtStart.body[0]
        const updatedLikesOfTheBlog = {
            likes: blogToUpdate.likes + 1
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedLikesOfTheBlog)
            .expect(200)

        const response = await api.get(`/api/blogs/${blogToUpdate.id}`)
        assert.strictEqual(updatedLikesOfTheBlog.likes, response.body.likes)
    })
})

after(async () => {
    await mongoose.connection.close()
})