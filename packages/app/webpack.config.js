const path = require('path');
const webpackMerge = require('webpack-merge');
const baseComponentConfig = require('@splunk/webpack-configs/component.config').default;


module.exports = webpackMerge(baseComponentConfig, {
    entry: {
        App: path.join(__dirname, 'src/App.jsx'),
    },
    output: {
        path: path.join(__dirname),
    },
    module: {
        rules: [
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: ['style-loader', 'css-loader'],
            },
            {
              test: /\.css$/i,
              use: ['style-loader', 'css-loader'],
            },
            {
              test: /\.txt$/,
              use: ['raw-loader'],
            },
            
          ],
    },
});
