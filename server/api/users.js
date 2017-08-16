import express from 'express';
import bcrypt from 'bcrypt';
import signupValidation from '../validations/signup';
import jwt from 'jsonwebtoken';
import config from '../config';
import authenticate from '../middlewares/authenticate';

import User from '../models/user';

let router = express.Router();

router.get('/:userId', (req, res) => {
    User.query({
        where: { id: req.params.userId }
    }).fetch().then(user => {
        if(user) res.json(user);
        else res.status(403).json({ errors: 'There is no user with such id'});
    })

});

router.post('/', (req, res) => {
    let { errors, isValid } = signupValidation(req.body);
    if(isValid) {
        const { username, email, password } = req.body;
        const password_digest = bcrypt.hashSync(password,10);

        User.forge({ username, email, password_digest },{ hasTimestamps: true }).save()
            .then(user => {
                const token = jwt.sign({
                    id: user.get('id'),
                    username: user.get('username')
                }, config.jwtSecret);

                user.set('is_online', true);
                user.save();

                res.json({ token: token });
            })
            .catch(err => {
                res.status(500).json({ success: false, errors: err });
            })

    } else res.status(403).json({ success: false, errors: errors });
});

router.put('/offline', authenticate, (req, res) => {
    User.query({
        where: { id: req.currentUser.id }
    }).fetch().then(user => {
        if(user) {
            user.set('is_online', false);
            user.save();
            res.json({success: true});
        } else res.status(403).json({ errors: 'There is no user with such id'});
    })
});

// router.delete('/:id', authenticate, (req, res) => {
//     User.query({
//         where: { id: req.params.id }
//     }).fetch().then(user => {
//         if(user) {
//             user.destroy();
//             res.json(user);
//         } else res.status(404).json({ errors: 'There is no user with such id'});
//     })
// });

export default router;