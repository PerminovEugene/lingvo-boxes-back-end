const createError = require('http-errors');

module.exports = {
    handleError: (err, httpCode, errorCode, handler) => {
        if (err) {
            return handler(createError(httpCode, {code: errorCode, reason: err}));
        }
    },
    "new": (code, message) => {
        if (typeof code === "number") {
            return createError(code, message)
        }
        if (typeof code === "string") {
            return new createError[code](message)
        }
    }
};