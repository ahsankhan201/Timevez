const jwt = require("jsonwebtoken"); // import JWT token
const { jwt_secret_key } = require('../config');
const { rolePermission } = require('./permissions');
const { sharedUtil } = require('../shared');
const { exception } = require('../responses');

/** 
 * Checks if the user is logged in, token is expired and user has permission to access requested url. 
 */
module.exports = (req, res, next) => {
    // try {
        /** Decrypt data, if payload property is available in req.body */
        if (req.body.payload) {
            req.body = sharedUtil.decryptData(req.body.payload);
        }

        // const requestUrl = `${req.baseUrl}${req.route.path}`;
        // if (req.headers.authorization) {
        //     const token = req.headers.authorization.split(" ")[1];
        //     const decodedToken = jwt.verify(token, jwt_secret_key);
        //     const { username, userId, role, exp } = decodedToken;

        //     /** Check role permission for requested url. */
        //     if (rolePermission[role].indexOf(requestUrl) == -1) {
        //         return exception(res, 401, 'Access Denied For Requested Url.');
        //     }

        //     /** Check if token has expired */
        //     if (exp < Date.now().valueOf() / 1000) {
        //         return exception(res, 401, 'JWT token has expired, please login to obtain a new one');
        //     }

        //     /** Attach user related info in request. This info can be accessed from req. */
        //     req.userData = { username: username, userId: userId };
        //     next();
        // } else {
        //     if (rolePermission['Anonymous'].indexOf(requestUrl) == -1) {
        //         return exception(res, 401, 'Access Denied.');
        //     }

            next();
    //     }
    // } catch (error) {
    //     return exception(res, 401, 'Access Denied For Requested Url, please login agian');
    // }
}
