import express from 'express';

import User from '../models/user';
import Friend from '../models/friend';
import Chat from '../models/chat';

import authenticate from '../middlewares/authenticate';

let router = express.Router();

router.get('/pending', authenticate, (req, res) => {
    Friend.query({
        where: {  user_id2: req.currentUser.id,
                    status: 'pending' }
    }).fetchAll().then(friends => {
        let userIdArray = [];

        friends.map(friend => {
            userIdArray.push(friend.get('user_id1'));
        });

        User.query("whereIn", "id", userIdArray).fetchAll({ columns: ['id','username']}).then(users => {
            res.json(users);
        });

    })
});

router.get('/accepted', authenticate, (req, res) => {
    Friend.query({
        where: {    user_id1: req.currentUser.id,
            status: 'accept' },
        orWhere: {  user_id2: req.currentUser.id,
            status: 'accept' }
    }).fetchAll().then(friends => {
        let userIdArray = [];

        friends.map(friend => {
            if(friend.get('user_id1') == req.currentUser.id) userIdArray.push(friend.get('user_id2'));
            else userIdArray.push(friend.get('user_id1'));
        });

        User.query("whereIn", "id", userIdArray).fetchAll({ columns: ['id','username','is_online']}).then(users => {
            res.json(users);
        });

    })
});

router.post('/', authenticate, (req, res) => {
    const { friendEmail } = req.body;

    User.query({ where: { email: friendEmail } }).fetch().then(user => {
        if(user) {
                if(req.currentUser.id != user.get('id')) {
                    Friend.query({
                        where: {
                            user_id1: req.currentUser.id,
                            user_id2: user.get('id')
                        },
                        orWhere: {
                            user_id1: user.get('id'),
                            user_id2: req.currentUser.id
                        }
                    }).fetch().then(friend => {
                        if (!friend) {
                            Friend.forge({
                                user_id1: req.currentUser.id,
                                user_id2: user.get('id'),
                                status: 'pending' },{ hasTimestamps: true }).save()
                                .then(friendRecord => {
                                    res.json(friendRecord);
                                })
                                .catch(err => {
                                    res.status(500).json({ success: false, errors: err });
                                })
                        } else res.status(403).json({errors: 'Friend request was already sended or accepted'})
                    });
                } else res.status(403).json({errors: 'You cannot send friend request to yourself'})
        } else res.status(403).json({errors: 'There is no user with such email'})
    });
});

router.put('/accept', authenticate, (req, res) => {
    const { friendId } = req.body;

    Friend.query({
        where: {  user_id1: friendId,
            user_id2: req.currentUser.id,
            status: 'pending'}
    }).fetch().then(friend => {
        if(friend) {
            friend.set('status', 'accept');
            friend.save();

            User.query({
                where: {id: friendId}
            }).fetch({columns: ['id', 'username', 'is_online']}).then(user => {
                if (user) {
                    const members = [req.currentUser.id, friendId];
                    const name = user.get('username') + ',' + req.currentUser.get('username');
                    Chat.forge({
                        name: name,
                        members: members
                    },{ hasTimestamps: true }).save();


                    res.json(user);
                }
                else res.status(403).json({errors: 'There is no user with such id'});
            });
        } else res.status(403).json({errors: 'There is no pending friend request'});
    })
});

router.delete('/:friendId', authenticate, (req, res) => {
    if(req.params.friendId) {
        Friend.query({
            where: {
                user_id1: req.currentUser.id,
                user_id2: req.params.friendId
            },
            orWhere: {
                user_id1: req.params.friendId,
                user_id2: req.currentUser.id
            }
        }).fetch().then(friend => {
            if (friend) {
                const members = [req.currentUser.id, parseInt(req.params.friendId)];

                Chat.query(function(qb) {
                    qb.where('members', '=' , members.reverse()).orWhere('members', '=' , members.reverse());  //REVERSE UPDATE VARIABLE
                }).fetchAll().then(chats => {
                    if(chats) {
                        chats.map(chat => {
                            chat.destroy();
                        })
                    }
                });

                friend.destroy();

                User.query({
                    where: {id: req.params.friendId}
                }).fetch({columns: ['id', 'username']}).then(user => {
                    if (user) res.json(user);
                    else res.status(403).json({errors: 'There is no user with such id'});
                });
            } else res.status(403).json({errors: 'There is no friend with such id'});
        })
    } else res.status(403).json({ errors: 'There is no friendId in query'});
});

export default router;