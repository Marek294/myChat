import jwt from 'jsonwebtoken';
import config from '../config';

import User from '../models/user';

export default (req, res, next) => {
    const authorizationHeader = req.headers['authorizationtoken'];
    let token;

    if(authorizationHeader) token = authorizationHeader.split(' ')[1];

    if(token) {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
           if(err) {
               res.status(401).json({ error: 'Failed to authenticate' });
           } else {
               User.query({
                   select: ['id', 'username', 'email'],
                   where: { id: decoded.id }
               }).fetch().then(user => {
                   if(user) {
                       req.currentUser = user;
                       next();
                   } else {
                       res.status(404).json({ error: 'No such user' });
                   }
               })
           }
        });
    } else {
        res.status(403).json({ error: 'No token provided' });
    }
};