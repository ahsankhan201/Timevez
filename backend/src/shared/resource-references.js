const { base_url } = require('../config');

/**
 * For API Requests
 */
module.exports = {
    /** Common */
    add: `/add`,
    list: `/list`,
    listById: `/list/:id`,
    updateById: `/update/:id`,
    deleteById: `/delete/:id`,
    totalCount: `/totalCount`,
    totalCountByUserId: `/totalCountByUserId`,
    uploadPhotoById: `/uploadphoto/:id`,


    /** User */
    userBaseUrl: `${base_url}/user`,
    login: `/login`,
    register: `/register`,
    changePassword: `/changePassword`,
    pagedUsers: `/pagedUsers`,

    /** Attendance */
    attendanceBaseUrl: `${base_url}/attendance`,
    checkIn: `/checkIn`,
    checkOut: `/checkOut`,
    startBreak: `/startBreak`,
    endBreak: `/endBreak`,
    pagedAttendances: `/pagedAttendances`,
    pagedUserAttendances: `/pagedUserAttendances`,
  
    /** Leave */
    leaveBaseUrl: `${base_url}/leave`,
    leaveRequest: `/leaveRequest`,
    pagedLeaves: `/pagedLeaves`,
    pagedUserLeaves: `/pagedUserLeaves`,
}