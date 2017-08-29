import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import socket from 'socket.io';
import http from 'http';
import morgan from 'morgan';
import findIndex from 'lodash/findIndex';

import users from './api/users';
import auth from './api/auth';
import friends from './api/friends';
import chats from './api/chats';
import messages from './api/messages';

import User from './models/user';

let app = express();
let server = http.Server(app);

let webpack;
let webpackMiddleware;
let webpackHotMiddleware;
let webpackConfig;

if(process.env.NODE_ENV.trim() === 'development') {
    webpack = require('webpack');
    webpackMiddleware = require('webpack-dev-middleware');
    webpackHotMiddleware = require('webpack-hot-middleware');

    webpackConfig = require('../webpack.config.dev');
    const compiler = webpack(webpackConfig);

    app.use(webpackMiddleware(compiler));
    app.use(webpackHotMiddleware(compiler, {
        hot: true,
        publicPath: webpackConfig.output.publicPath,
        noInfo: true
    }));
}

app.use(express.static('public'));
app.use(bodyParser());
app.use(morgan('dev'));

app.use('/api/auth',auth);
app.use('/api/users',users);
app.use('/api/friends',friends);
app.use('/api/chats',chats);
app.use('/api/messages',messages);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

const port = process.env.PORT || 3000;

server.listen(port, () => console.log('Running on port: '+port));

// Setup socket
var io = socket(server, {
    'pingInterval': 10*1000,
    'pingTimeout': 5*1000,
});

let usersOnline = [];

io.on('connection', function(socket) {
    console.log('Connection was made ' + socket.id);
    socket.on('USER_ONLINE', (user) => {
        //console.log(user);
        if(user) {
            const index = findIndex(usersOnline, {username: user.username});
            if (index < 0) {
                let userInformation = user;
                userInformation.socketId = socket.id;
                usersOnline.push(userInformation);
                socket.broadcast.emit('SERVER_USER_ONLINE', user);
                User.query({
                    where: { id: user.id }
                }).fetch().then(user => {
                    if(user) {
                        user.set('is_online', true);
                        user.save();
                    }
                })
            } else {
                socket.broadcast.emit('SERVER_USER_ONLINE', user);
            }
        }
    });

    socket.on('USER_OFFLINE', function(user) {
        socket.broadcast.emit('SERVER_USER_OFFLINE', user);
    });

    socket.on('SEND_MESSAGE', (message) => {
        //console.log(message);
        socket.broadcast.emit(`SERVER_NEW_MESSAGE:${message.chat_id}`, message);
        socket.broadcast.emit('SERVER_NEW_MESSAGE',message.chat_id);
        //:${message.chat_id}
    });

    socket.on('START_TYPING', (username, chat_id) => {
        //console.log(message);
        socket.broadcast.emit(`SERVER_START_TYPING:${chat_id}`, username);
        //:${message.chat_id}
    });

    socket.on('STOP_TYPING', (username, chat_id) => {
        //console.log(message);
        socket.broadcast.emit(`SERVER_STOP_TYPING:${chat_id}`, username);
        //:${message.chat_id}
    });


    socket.on('disconnect', function(reason) {
        console.log('disconnect', socket.id);
        const index = findIndex(usersOnline, { socketId: socket.id });
        let removedUser;
        if(index > -1) removedUser = usersOnline.splice(index,1);
        setTimeout(() => {
            if(removedUser) {
                const index = findIndex(usersOnline, { username: removedUser[0].username });
                if (index > -1) console.log('User reconnected');
                else {
                    console.log('user has left');
                    socket.broadcast.emit('SERVER_USER_OFFLINE', removedUser[0]);
                    User.query({
                        where: { id: removedUser[0].id }
                    }).fetch().then(user => {
                        if(user) {
                            user.set('is_online', false);
                            user.save();
                        }
                    })
                }
            }
        },5*1000)
    });
});

export default server;