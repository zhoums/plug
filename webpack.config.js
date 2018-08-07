var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        eventPage: "./eventPage.js",
    },
    output: {
        filename: '[name].js', // string
        path: resolve(__dirname, '../dist'),
    }
}