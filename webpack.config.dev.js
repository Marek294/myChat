import path from 'path';
import webpack from 'webpack';

export default {
    entry: [
        'webpack-hot-middleware/client',
        path.join(__dirname, './client/index.js')
    ],
    output: {
        path: __dirname,
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'client'),
                loaders: [ 'react-hot-loader', 'babel-loader' ]
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    resolve: {
        extensions: [ '.js' ]
    },
    node: {
        net: 'empty',
        dns: 'empty'
    }
}