'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _signup = require('../validations/signup');

var _signup2 = _interopRequireDefault(_signup);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _authenticate = require('../middlewares/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:userId', function (req, res) {
    _user2.default.query({
        where: { id: req.params.userId }
    }).fetch().then(function (user) {
        if (user) res.json(user);else res.status(403).json({ errors: 'There is no user with such id' });
    });
});

router.post('/', function (req, res) {
    var _signupValidation = (0, _signup2.default)(req.body),
        errors = _signupValidation.errors,
        isValid = _signupValidation.isValid;

    if (isValid) {
        var _req$body = req.body,
            username = _req$body.username,
            email = _req$body.email,
            password = _req$body.password;

        var password_digest = _bcrypt2.default.hashSync(password, 10);

        _user2.default.forge({ username: username, email: email, password_digest: password_digest }, { hasTimestamps: true }).save().then(function (user) {
            var token = _jsonwebtoken2.default.sign({
                id: user.get('id'),
                username: user.get('username')
            }, _config2.default.jwtSecret);

            user.set('is_online', true);
            user.save();

            res.json({ token: token });
        }).catch(function (err) {
            res.status(500).json({ success: false, errors: err });
        });
    } else res.status(403).json({ success: false, errors: errors });
});

router.put('/offline', _authenticate2.default, function (req, res) {
    _user2.default.query({
        where: { id: req.currentUser.id }
    }).fetch().then(function (user) {
        if (user) {
            user.set('is_online', false);
            user.save();
            res.json({ success: true });
        } else res.status(403).json({ errors: 'There is no user with such id' });
    });
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

exports.default = router;
//# sourceMappingURL=users.js.map