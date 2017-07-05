import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import bodyParser from 'body-parser';

import webpackConfig from '../webpack.config.dev';

import users from './api/users';
import auth from './api/auth';

let app = express();

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

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

const port = process.env.port || 3000;

app.listen(port, () => console.log('Running on port '+port));