const { ApiUrl } = require('../../shared');

/**
 * Role permission for API Requests
 */
module.exports = {
    "Admin": [
        /** User Routes */
        `${ApiUrl.userBaseUrl}${ApiUrl.list}`,
        `${ApiUrl.userBaseUrl}${ApiUrl.listById}`,
        `${ApiUrl.userBaseUrl}${ApiUrl.pagedUsers}`,
        `${ApiUrl.userBaseUrl}${ApiUrl.register}`,
        `${ApiUrl.userBaseUrl}${ApiUrl.changePassword}`,
        `${ApiUrl.userBaseUrl}${ApiUrl.updateById}`,
        `${ApiUrl.userBaseUrl}${ApiUrl.deleteById}`,
        `${ApiUrl.userBaseUrl}${ApiUrl.totalCount}`,
        `${ApiUrl.userBaseUrl}${ApiUrl.uploadPhotoById}`,
        /** Attendance Routes */
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.list}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.listById}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.pagedAttendances}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.pagedUserAttendances}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.add}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.updateById}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.deleteById}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.totalCount}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.totalCountByUserId}`,
        /** Leave Routes */
        `${ApiUrl.leaveBaseUrl}${ApiUrl.pagedUserLeaves}`,
        `${ApiUrl.leaveBaseUrl}${ApiUrl.pagedLeaves}`,
        `${ApiUrl.leaveBaseUrl}${ApiUrl.listById}`,
        `${ApiUrl.leaveBaseUrl}${ApiUrl.add}`,
        `${ApiUrl.leaveBaseUrl}${ApiUrl.updateById}`,
        `${ApiUrl.leaveBaseUrl}${ApiUrl.deleteById}`,
        `${ApiUrl.leaveBaseUrl}${ApiUrl.totalCount}`,
        `${ApiUrl.leaveBaseUrl}${ApiUrl.totalCountByUserId}`
    ],
    "Employee": [
        /** User Routes */
        `${ApiUrl.userBaseUrl}${ApiUrl.changePassword}`,
        /** Attendance Routes */
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.pagedUserAttendances}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.checkIn}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.checkOut}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.startBreak}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.endBreak}`,
        `${ApiUrl.attendanceBaseUrl}${ApiUrl.totalCountByUserId}`,
        /** Leave Routes */
        `${ApiUrl.leaveBaseUrl}${ApiUrl.leaveRequest}`,
        `${ApiUrl.leaveBaseUrl}${ApiUrl.pagedUserLeaves}`,
        `${ApiUrl.leaveBaseUrl}${ApiUrl.totalCountByUserId}`
    ],
    "Anonymous": [
        `${ApiUrl.userBaseUrl}${ApiUrl.login}`
    ]
}