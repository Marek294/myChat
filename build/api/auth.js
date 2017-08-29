'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', function (req, res) {
    var _req$body = req.body,
        username = _req$body.username,
        password = _req$body.password;


    _user2.default.query({
        where: { username: username }
    }).fetch().then(function (user) {
        if (user) {
            if (_bcrypt2.default.compareSync(password, user.get('password_digest'))) {

                var token = _jsonwebtoken2.default.sign({
                    id: user.get('id'),
                    username: user.get('username')
                }, _config2.default.jwtSecret);

                user.set('is_online', true);
                user.save();

                res.json({ token: token });
            } else res.status(403).json({ errors: { form: 'Invalid authentication' } });
        } else res.status(403).json({ errors: { form: 'Invalid authentication' } });
    });
});

exports.default = router;
//# sourceMappingURL=auth.js.map