const { describe, beforeEach, test, after } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');
const helper = require('../utils/user_helper');

const api = supertest(app);

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDB();

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        assert(usernames.includes(newUser.username));
    });

    test('new users must have password and username', async () => {
        const newUser = {
            username: 'mluukkai3',
            name: 'Matti Luukkainen2',
            password: 'salainen',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    });

    test('password and user name must be at least 3 characters long', async () => {
        const newUser = {
            username: 'mluukkai2',
            name: 'Matti Luukkaine3',
            password: 'salainen',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    });
});

after(async () => {
    await mongoose.connection.close();
});