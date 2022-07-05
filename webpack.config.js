module.exports = function(env) {
    return require(`./webpack.${env.gigi}.config.js`)
};