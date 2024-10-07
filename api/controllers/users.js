const usersRouter = require('express').Router();
const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

usersRouter.get('/', async (req, res, next) => {
    try {
         const users = await User.find({}).select('username name id');
         res.send(users);
    } catch {
        next(error);
    }
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;

    const saltRounds = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = await user.save();

    res.status(201).send(savedUser);
});

module.exports = usersRouter;