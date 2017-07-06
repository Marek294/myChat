import express from 'express';

import User from '../models/user';
import Friend from '../models/friend';

import authenticate from '../middlewares/authenticate';

let router = express.Router();

router.get('/pending', authenticate, (req, res) => {
    Friend.query({
        where: {    user_id1: req.currentUser.id,
                    status: 'pending' },
        orWhere: {  user_id2: req.currentUser.id,
                    status: 'pending' }
    }).fetchAll().then(friends => {
        let userIdArray = [];

        friends.map(friend => {
            if(friend.get('user_id1') == req.currentUser.id) userIdArray.push(friend.get('user_id2'));
            else userIdArray.push(friend.get('user_id1'));
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
    const { friendId } = req.body;

    if(req.currentUser.id != friendId)
    {
        let p1 = User.query({ where: { id: friendId } }).fetch();
        let p2 = Friend.query({ where: {    user_id1: req.currentUser.id,
                                            user_id2: friendId },
                                orWhere: {  user_id1: friendId,
                                            user_id2: req.currentUser.id }}).fetch();

        Promise.all([p1, p2]).then(values => {
            if(!values[1]) {
                if(values[0]) {
                    Friend.forge({
                        user_id1: req.currentUser.id,
                        user_id2: friendId,
                        status: 'pending' },{ hasTimestamps: true }).save()
                        .then(friendRecord => {
                            res.json(friendRecord);
                        })
                        .catch(err => {
                            res.status(500).json({ success: false, errors: err });
                        })
                } else res.status(403).json({errors: 'There is no user with such id'})
            } else res.status(403).json({ errors: 'Friend request was already sended or accepted'})
        })
    } else res.status(403).json({errors: 'You cannot send friend request to yourself'})
});

router.put('/accept', authenticate, (req, res) => {
    const { friendId } = req.body;

    Friend.query({
        where: {    user_id1: req.currentUser.id,
                    user_id2: friendId,
                    status: 'pending'},
        orWhere: {  user_id1: friendId,
                    user_id2: req.currentUser.id,
                    status: 'pending'}
    }).fetch().then(friend => {
        if(friend) {
            friend.set('status', 'accept');
            friend.save();

            res.json(friend);
        } else res.status(403).json({errors: 'There is no pending friend request'});
    })
});

router.delete('/:friendId', authenticate, (req, res) => {
    Friend.query({
        where: {    user_id1: req.currentUser.id,
                    user_id2: req.params.friendId},
        orWhere: {  user_id1: req.params.friendId,
                    user_id2: req.currentUser.id}
    }).fetch().then(friend => {
        if(friend) {
            friend.destroy();
            res.json(friend);
        } else res.status(403).json({errors: 'There is no friend with such id'});
    })
});

export default router;