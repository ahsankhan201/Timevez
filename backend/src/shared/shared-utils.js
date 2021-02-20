var CryptoJS = require("crypto-js");
const { crypto_secret_key } = require('../config');

/**
 * @params filter type
 * @returns {object} from Date and to Date
 */
// module.exports.getTimeFilter = (filterType, startDate = null, endDate = null) => {
module.exports.getTimeFilter = (filterType, fromDate = null, toDate = null) => {
    const now = new Date();
    var startDate;
    var endDate;

    switch (filterType) {
        case 'custom': // If no from-date then startDate = (from start of current year), if to-date then endDate = today date 
            startDate = fromDate ? new Date(fromDate) : new Date(now.getFullYear(), 0, 1);
            endDate = toDate ? new Date(toDate) : now;
            break;
        case 'currentDate':
            startDate = now.setHours(0, 0, 0, 0);
            endDate = now.setHours(23, 59, 59, 999);
            break;
        case 'yesterday':
           var previousDate = new Date(now.setDate(now.getDate() -1));
            startDate = previousDate.setHours(0, 0, 0, 0);
            endDate = previousDate.setHours(23, 59, 59, 999);
            break;
        case 'currentMonth':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = now;
            break;
        case 'lastMonth':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
        case 'currentYear':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = now;
            break;
        case 'lastYear':
            startDate = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0);
            endDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
            break;

        default: // Current date
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
            break;
    }

    return { startDate: startDate, endDate: endDate };
}

/** 
 * Decrypt data 
 */
module.exports.decryptData = (dataToConvert) => {
    return JSON.parse(CryptoJS.AES.decrypt(dataToConvert, crypto_secret_key.trim()).toString(CryptoJS.enc.Utf8));
}

/** 
 * Encrypt data 
 */
module.exports.encryptData = (dataToConvert) => {
    return CryptoJS.AES.encrypt(JSON.stringify(dataToConvert), crypto_secret_key.trim()).toString();
}

/**
 * Convert time of date to 0
 */
module.exports.setZeroHours = (dateToConvert) => {
    var date = new Date(dateToConvert);
    date.setHours(0, 0, 0, 0);
    return date;
}
