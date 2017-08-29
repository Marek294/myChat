'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _chat = require('../models/chat');

var _chat2 = _interopRequireDefault(_chat);

var _message = require('../models/message');

var _message2 = _interopRequireDefault(_message);

var _authenticate = require('../middlewares/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', _authenticate2.default, function (req, res) {
    var _req$body = req.body,
        chat_id = _req$body.chat_id,
        content = _req$body.content;

    var sender_id = req.currentUser.id;

    _message2.default.forge({
        chat_id: chat_id,
        sender_id: sender_id,
        content: content
    }).save().then(function (message) {
        res.json(message);
    }).catch(function (err) {
        res.status(500).json({ errors: err });
    });
});

router.get('/:chatId/:page', _authenticate2.default, function (req, res) {
    var p1 = _message2.default.query({
        where: { chat_id: req.params.chatId }
    }).orderBy('id', 'DESC').fetchPage({ page: req.params.page, pageSize: 15 });

    var p2 = _chat2.default.query({
        where: { id: req.params.chatId }
    }).fetch();

    Promise.all([p1, p2]).then(function (values) {
        if (values[1]) {
            if (values[1].get('members').indexOf(req.currentUser.id) > -1) {
                res.json({
                    messages: values[0],
                    pagination: values[0].pagination
                });
            } else res.status(403).json({ errors: 'You have no access to this chat' });
        } else res.status(403).json({ errors: 'There is no chat with such id' });
    });
});

exports.default = router;
//# sourceMappingURL=messages.js.map