import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import bodyParser from 'body-parser';
import socket from 'socket.io';
import http from 'http';

import webpackConfig from '../webpack.config.dev';

import users from './api/users';
import auth from './api/auth';
import friends from './api/friends';

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
var io = socket(server);

io.on('connection', function(socket) {
    console.log('Connection was made ' + socket.id);
    socket.on('USER_ONLINE', function(user) {
        console.log(user);
        socket.broadcast.emit('SERVER_USER_ONLINE', user);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

export default server;