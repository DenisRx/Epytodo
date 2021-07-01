const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: function (userId) {
        return jwt.sign({ id: userId }, process.env.SECRET);
    },

    verifyToken: function (tokenRequest) {
        if (tokenRequest == undefined) return 1;

        let token = tokenRequest.split(' ')[1];
        if (tokenRequest.split(' ')[0] !== 'Bearer') return 2;

        return jwt.verify(token, process.env.SECRET, (err, verifiedToken) => {
            if (err) {
                return 2;
            } else {
                return token;
            }
        });
    },

    getId: function (token) {
        let data = token.split('.')[1];
        let buff = new Buffer.from(data, 'base64');
        let text = buff.toString('ascii');
        text = text.split(":")[1];
        text = text.split(",")[0];
        return text;
    }
}