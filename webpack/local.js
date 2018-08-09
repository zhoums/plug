const webpackMerge = require('webpack-merge')
const common = require('./common')


module.exports = webpackMerge(common, {

    // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",

    watch: false,

})
