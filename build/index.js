'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _findIndex = require('lodash/findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

var _users = require('./api/users');

var _users2 = _interopRequireDefault(_users);

var _auth = require('./api/auth');

var _auth2 = _interopRequireDefault(_auth);

var _friends = require('./api/friends');

var _friends2 = _interopRequireDefault(_friends);

var _chats = require('./api/chats');

var _chats2 = _interopRequireDefault(_chats);

var _messages = require('./api/messages');

var _messages2 = _interopRequireDefault(_messages);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = _http2.default.Server(app);

var webpack = void 0;
var webpackMiddleware = void 0;
var webpackHotMiddleware = void 0;
var webpackConfig = void 0;

if (process.env.NODE_ENV.trim() === 'development') {
    webpack = require('webpack');
    webpackMiddleware = require('webpack-dev-middleware');
    webpackHotMiddleware = require('webpack-hot-middleware');

    webpackConfig = require('../webpack.config.dev');
    var compiler = webpack(webpackConfig);

    app.use(webpackMiddleware(compiler));
    app.use(webpackHotMiddleware(compiler, {
        hot: true,
        publicPath: webpackConfig.output.publicPath,
        noInfo: true
    }));
}

app.use(_express2.default.static('public'));
app.use((0, _bodyParser2.default)());
app.use((0, _morgan2.default)('dev'));

app.use('/api/auth', _auth2.default);
app.use('/api/users', _users2.default);
app.use('/api/friends', _friends2.default);
app.use('/api/chats', _chats2.default);
app.use('/api/messages', _messages2.default);

app.get('/*', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '../public/index.html'));
});

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), function () {
    return console.log('Running on port: ' + port);
});

// Setup socket
var io = (0, _socket2.default)(server, {
    'pingInterval': 10 * 1000,
    'pingTimeout': 5 * 1000
});

var usersOnline = [];

io.on('connection', function (socket) {
    console.log('Connection was made ' + socket.id);
    socket.on('USER_ONLINE', function (user) {
        //console.log(user);
        if (user) {
            var index = (0, _findIndex2.default)(usersOnline, { username: user.username });
            if (index < 0) {
                var userInformation = user;
                userInformation.socketId = socket.id;
                usersOnline.push(userInformation);
                socket.broadcast.emit('SERVER_USER_ONLINE', user);
                _user2.default.query({
                    where: { id: user.id }
                }).fetch().then(function (user) {
                    if (user) {
                        user.set('is_online', true);
                        user.save();
                    }
                });
            } else {
                socket.broadcast.emit('SERVER_USER_ONLINE', user);
            }
        }
    });

    socket.on('USER_OFFLINE', function (user) {
        socket.broadcast.emit('SERVER_USER_OFFLINE', user);
    });

    socket.on('SEND_MESSAGE', function (message) {
        //console.log(message);
        socket.broadcast.emit('SERVER_NEW_MESSAGE:' + message.chat_id, message);
        socket.broadcast.emit('SERVER_NEW_MESSAGE', message.chat_id);
        //:${message.chat_id}
    });

    socket.on('START_TYPING', function (username, chat_id) {
        //console.log(message);
        socket.broadcast.emit('SERVER_START_TYPING:' + chat_id, username);
        //:${message.chat_id}
    });

    socket.on('STOP_TYPING', function (username, chat_id) {
        //console.log(message);
        socket.broadcast.emit('SERVER_STOP_TYPING:' + chat_id, username);
        //:${message.chat_id}
    });

    socket.on('disconnect', function (reason) {
        console.log('disconnect', socket.id);
        var index = (0, _findIndex2.default)(usersOnline, { socketId: socket.id });
        var removedUser = void 0;
        if (index > -1) removedUser = usersOnline.splice(index, 1);
        setTimeout(function () {
            if (removedUser) {
                var _index = (0, _findIndex2.default)(usersOnline, { username: removedUser[0].username });
                if (_index > -1) console.log('User reconnected');else {
                    console.log('user has left');
                    socket.broadcast.emit('SERVER_USER_OFFLINE', removedUser[0]);
                    _user2.default.query({
                        where: { id: removedUser[0].id }
                    }).fetch().then(function (user) {
                        if (user) {
                            user.set('is_online', false);
                            user.save();
                        }
                    });
                }
            }
        }, 5 * 1000);
    });
});

exports.default = server;
//# sourceMappingURL=index.js.map