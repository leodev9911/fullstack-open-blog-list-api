const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

usersRouter.get('/', async (req, res, next) => {
    try {
         const users = await User.find({})
            .select('username name id notes')
            .populate('blogs', {
                title: 1,
                url: 1,
                author: 1,
            });
         res.send(users);
    } catch (error) {
        next(error);
    }
});

usersRouter.post('/', async (req, res, next) => {
    try {
        const { username, name, password } = req.body;

        if (!password) {
            return res
                    .status(400)
                    .send({ error: 'The password is required' })
                    .end();
        } else if (password.length < 3) {
            return res
                    .status(400)
                    .send({ error: 'The password must be at least 3 characters long' })
                    .end();
        }

        const saltRounds = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, saltRounds);
    
        const user = new User({
            username,
            name,
            passwordHash
        });
    
        const savedUser = await user.save();
    
        res.status(201).send(savedUser);
    } catch (error) {
        next(error);
    }
});

module.exports = usersRouter;