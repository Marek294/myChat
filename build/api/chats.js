'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _chat = require('../models/chat');

var _chat2 = _interopRequireDefault(_chat);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _authenticate = require('../middlewares/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/all', _authenticate2.default, function (req, res) {
    var member = [];
    member.push(req.currentUser.id);

    _chat2.default.query(function (qb) {
        qb.where('members', '@>', member);
    }).fetchAll().then(function (chats) {
        if (chats) {
            var p2 = chats.map(function (chat) {
                var index = chat.get('name').indexOf(req.currentUser.get('username'));
                if (index > -1) {
                    var displayName = chat.get('name');
                    index > 0 ? displayName = displayName.substr(0, index - 1) + displayName.substr(index + req.currentUser.get('username').length, displayName.length) : displayName = displayName.substr(req.currentUser.get('username').length + 1, displayName.length);

                    chat.set('name', displayName);

                    var p = chat.get('members').map(function (userId) {
                        return _user2.default.query({
                            where: { id: userId }
                        }).fetch();
                    });

                    chat.set('online', false);
                    return Promise.all(p).then(function (users) {
                        for (var i = 0; i < users.length; i++) {
                            if (users[i].get('id') != req.currentUser.get('id') && users[i].get('is_online')) {
                                chat.set('online', true);
                                break;
                            }
                        }
                    });
                }
            });

            Promise.all(p2).then(function () {
                res.json(chats);
            });
        }
    });
});

router.get('/:id', _authenticate2.default, function (req, res) {
    _chat2.default.query({
        where: { id: req.params.id }
    }).fetch({ withRelated: ['messages'] }).then(function (chat) {
        if (chat) {
            if (chat.get('members').indexOf(req.currentUser.id) > -1) {
                res.json(chat);
            } else res.status(403).json({ errors: 'You have no access to this chat' });
        } else res.status(403).json({ errors: 'There is no chat with such id' });
    });
});

router.get('/:friendId', _authenticate2.default, function (req, res) {
    var members = [req.currentUser.id, parseInt(req.params.friendId)];

    var reverseMembers = [parseInt(req.params.friendId), req.currentUser.id];

    _chat2.default.query(function (qb) {
        qb.where('members', '=', members).orWhere('members', '=', reverseMembers);
    }).fetch({ withRelated: ['messages'] }).then(function (chat) {
        if (chat) {
            var index = chat.get('name').indexOf(req.currentUser.get('username'));
            if (index > -1) {
                var displayName = chat.get('name');
                index > 0 ? displayName = displayName.substr(0, index - 1) + displayName.substr(index + req.currentUser.get('username').length, displayName.length) : displayName = displayName.substr(req.currentUser.get('username').length + 1, displayName.length);

                chat.set('name', displayName);
            }

            res.json(chat);
        } else res.status(403).json({ errors: 'There is no chat with this friend' });
    });
});

exports.default = router;
//# sourceMappingURL=chats.js.map