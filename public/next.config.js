const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.plugins.push(new CopyPlugin([
            { from: path.join(__dirname, 'node_modules/tinymce/skins'), to: path.join(__dirname, 'public/assets/libs/tinymce/skins') }, /// Copy to public folder
        ]));
        return config
    },
    webpackDevMiddleware: config => {
        return config
    },
}