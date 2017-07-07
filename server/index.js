import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import bodyParser from 'body-parser';
import socket from 'socket.io';
import http from 'http';
import findIndex from 'lodash/findIndex';

import webpackConfig from '../webpack.config.dev';

import users from './api/users';
import auth from './api/auth';
import friends from './api/friends';

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

app.use('/api/auth',auth);
app.use('/api/users',users);
app.use('/api/friends',friends);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

const port = process.env.port || 3000;

server.listen(port, () => console.log('Running on port '+port));

// Setup socket
var io = socket(server, {
    'pingInterval': 2000,
    'pingTimeout': 5000,
});

let socketsInformation = [];

io.on('connection', function(socket) {
    console.log('Connection was made ' + socket.id);
    socket.on('USER_ONLINE', function(user) {
        //console.log(user);
        socket.emit('SOCKET_ID', socket.id);
        socket.on('USER_INFORMATION', user => {
            socketsInformation.push(user);
            //console.log(socketsInformation, '-----------------------END');
        });

        socket.broadcast.emit('SERVER_USER_ONLINE', user);
    });
    socket.on('USER_OFFLINE', function(user) {
        //console.log(user);
        socket.broadcast.emit('SERVER_USER_OFFLINE', user);
    });

    socket.on('disconnect', function(reason) {
        console.log('disconnect', socket.id);
        const index = findIndex(socketsInformation, { socketId: socket.id });
        let removedUser;
        if(index > -1) removedUser = socketsInformation.splice(index,1);
        setTimeout(() => {
            if(removedUser) {
                const index = findIndex(socketsInformation, { username: removedUser[0].username });
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
        },5000)
    });
});

export default server;