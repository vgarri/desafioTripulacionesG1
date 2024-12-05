const morgan = require('morgan')
morgan.token('host', function (req, res) {
    return req.hostname;
});
morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})


 module.exports = morgan