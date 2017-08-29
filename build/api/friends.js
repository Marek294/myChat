'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _friend = require('../models/friend');

var _friend2 = _interopRequireDefault(_friend);

var _chat = require('../models/chat');

var _chat2 = _interopRequireDefault(_chat);

var _authenticate = require('../middlewares/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/pending', _authenticate2.default, function (req, res) {
    _friend2.default.query({
        where: { user_id2: req.currentUser.id,
            status: 'pending' }
    }).fetchAll().then(function (friends) {
        var userIdArray = [];

        friends.map(function (friend) {
            userIdArray.push(friend.get('user_id1'));
        });

        _user2.default.query("whereIn", "id", userIdArray).fetchAll({ columns: ['id', 'username'] }).then(function (users) {
            res.json(users);
        });
    });
});

router.get('/accepted', _authenticate2.default, function (req, res) {
    _friend2.default.query({
        where: { user_id1: req.currentUser.id,
            status: 'accept' },
        orWhere: { user_id2: req.currentUser.id,
            status: 'accept' }
    }).fetchAll().then(function (friends) {
        var userIdArray = [];

        friends.map(function (friend) {
            if (friend.get('user_id1') == req.currentUser.id) userIdArray.push(friend.get('user_id2'));else userIdArray.push(friend.get('user_id1'));
        });

        _user2.default.query("whereIn", "id", userIdArray).fetchAll({ columns: ['id', 'username', 'is_online'] }).then(function (users) {
            res.json(users);
        });
    });
});

router.post('/', _authenticate2.default, function (req, res) {
    var friendEmail = req.body.friendEmail;


    _user2.default.query({ where: { email: friendEmail } }).fetch().then(function (user) {
        if (user) {
            if (req.currentUser.id != user.get('id')) {
                _friend2.default.query({
                    where: {
                        user_id1: req.currentUser.id,
                        user_id2: user.get('id')
                    },
                    orWhere: {
                        user_id1: user.get('id'),
                        user_id2: req.currentUser.id
                    }
                }).fetch().then(function (friend) {
                    if (!friend) {
                        _friend2.default.forge({
                            user_id1: req.currentUser.id,
                            user_id2: user.get('id'),
                            status: 'pending' }, { hasTimestamps: true }).save().then(function (friendRecord) {
                            res.json(friendRecord);
                        }).catch(function (err) {
                            res.status(500).json({ success: false, errors: err });
                        });
                    } else res.status(403).json({ errors: 'Friend request was already sended or accepted' });
                });
            } else res.status(403).json({ errors: 'You cannot send friend request to yourself' });
        } else res.status(403).json({ errors: 'There is no user with such email' });
    });
});

router.put('/accept', _authenticate2.default, function (req, res) {
    var friendId = req.body.friendId;


    _friend2.default.query({
        where: { user_id1: friendId,
            user_id2: req.currentUser.id,
            status: 'pending' }
    }).fetch().then(function (friend) {
        if (friend) {
            friend.set('status', 'accept');
            friend.save();

            _user2.default.query({
                where: { id: friendId }
            }).fetch({ columns: ['id', 'username', 'is_online'] }).then(function (user) {
                if (user) {
                    var members = [req.currentUser.id, friendId];
                    var name = user.get('username') + ',' + req.currentUser.get('username');
                    _chat2.default.forge({
                        name: name,
                        members: members
                    }, { hasTimestamps: true }).save();

                    res.json(user);
                } else res.status(403).json({ errors: 'There is no user with such id' });
            });
        } else res.status(403).json({ errors: 'There is no pending friend request' });
    });
});

router.delete('/:friendId', _authenticate2.default, function (req, res) {
    if (req.params.friendId) {
        _friend2.default.query({
            where: {
                user_id1: req.currentUser.id,
                user_id2: req.params.friendId
            },
            orWhere: {
                user_id1: req.params.friendId,
                user_id2: req.currentUser.id
            }
        }).fetch().then(function (friend) {
            if (friend) {
                var members = [req.currentUser.id, parseInt(req.params.friendId)];

                var reverseMembers = [parseInt(req.params.friendId), req.currentUser.id];

                _chat2.default.query(function (qb) {
                    qb.where('members', '=', members).orWhere('members', '=', reverseMembers);
                }).fetchAll().then(function (chats) {
                    if (chats) {
                        chats.map(function (chat) {
                            chat.destroy();
                        });
                    }
                });

                friend.destroy();

                _user2.default.query({
                    where: { id: req.params.friendId }
                }).fetch({ columns: ['id', 'username'] }).then(function (user) {
                    if (user) res.json(user);else res.status(403).json({ errors: 'There is no user with such id' });
                });
            } else res.status(403).json({ errors: 'There is no friend with such id' });
        });
    } else res.status(403).json({ errors: 'There is no friendId in query' });
});

exports.default = router;
//# sourceMappingURL=friends.js.map