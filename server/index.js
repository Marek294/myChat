import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import bodyParser from 'body-parser';
import socket from 'socket.io';
import http from 'http';
import morgan from 'morgan';
import findIndex from 'lodash/findIndex';

import webpackConfig from '../webpack.config.dev';

import users from './api/users';
import auth from './api/auth';
import friends from './api/friends';
import chats from './api/chats';
import messages from './api/messages';

import User from './models/user';

let app = express();
let server = http.Server(app);

const compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
}));
app.use(webpackHotMiddleware(compiler));

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

const port = process.env.port || 3000;

server.listen(port, () => console.log('Running on port '+port));

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
            if (index == -1) {
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
        //console.log(message, toWho);
        socket.broadcast.emit('SERVER_NEW_MESSAGE', data);
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