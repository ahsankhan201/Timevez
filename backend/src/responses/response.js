const { errorMessages } = require('./error-messages');
const { sharedUtil } = require('../shared');

/**
  * Creates success response with encrypted data.
  * @param res
  * @param {object} result Data to be return.
  * @param {number} statusCode Response Status Code.
  */
exports.success = (res, result, statusCode = 200) => {
    // return res.status(statusCode).json(sharedUtil.encryptData(result));
    return res.status(statusCode).json(result);
}

/**
 * Create exception response with encrypted data.
 * @param {any} res
 * @param {number} statusCode Response Status Code.
 * @param {string} message Error message.
 */
exports.exception = (res, statusCode, message = '') => {
    const result = message && message.length ? { message: message } : getErrorMessage(statusCode);
    // return res.status(statusCode).json(sharedUtil.encryptData(result));
    return res.status(statusCode).json(result);
}

/**
 * Find and return error message against error code.
 * @param {number} statusCode Response Status Code.
 */
getErrorMessage = (statusCode) => {
    let error = errorMessages.find(x => x.code === statusCode);
    return { message: error.message };
};