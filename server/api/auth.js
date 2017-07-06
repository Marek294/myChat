import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

import User from '../models/user';

const router = express.Router();

router.post('/', (req, res) => {
    const { username, password } = req.body;

    User.query({
        where: { username: username}
    }).fetch().then(user => {
        if(user) {
            if(bcrypt.compareSync(password,user.get('password_digest'))) {

                const token = jwt.sign({
                    id: user.get('id'),
                    username: user.get('username')
                }, config.jwtSecret);

                user.set('is_online', true);
                user.save();

                res.json({ token: token });

            } else res.status(403).json({ errors: { form: 'Invalid authentication' } });
        } else res.status(403).json({ errors: { form: 'Invalid authentication' } });
    })

});

export default router;