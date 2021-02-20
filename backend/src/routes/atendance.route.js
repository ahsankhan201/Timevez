const express = require('express');
const router = express.Router();
const { attendanceController } = require('../controllers');
const { ApiUrl } = require('../shared');
const { JWTAuth } = require('../middlewares');

/**
 * @Post Check-in user against UserId.
 * @permission [Employee]
 */
router.post(`${ApiUrl.checkIn}`, JWTAuth, attendanceController.CheckIn);

/**
 * @Update Check-out user against UserId.
 * @permission [Employee]
 */
router.put(`${ApiUrl.checkOut}`, JWTAuth, attendanceController.CheckOut);

/**
 * @Update Start user break against UserId.
 * @permission [Employee]
 */
router.put(`${ApiUrl.startBreak}`, JWTAuth, attendanceController.startBreak);

/**
 * @Update End user break against UserId.
 * @permission [Employee]
 */
router.put(`${ApiUrl.endBreak}`, JWTAuth, attendanceController.endBreak);

/**
 * @Get Get Paged User Attendances By User Id.
 * @permission [Admin] [Employee]
 */
router.get(`${ApiUrl.pagedUserAttendances}`, JWTAuth, attendanceController.GetPagedUserAttendances);

/**
 * @Get Get Leaves total count by user id.
 * @permission [Admin] [Employee]
 */
router.get(`${ApiUrl.totalCountByUserId}`, JWTAuth, attendanceController.totalCountByUserId);

/**
 * @Get Get Leaves total count.
 * @permission [Admin] 
 */
router.get(`${ApiUrl.totalCount}`, JWTAuth, attendanceController.getTotalCount);

/**
 * @Get Get Paged Attendance list against page number.
 * @permission [Admin]
 */
router.get(`${ApiUrl.pagedAttendances}`, JWTAuth, attendanceController.GetPagedAttendances);

/**
 * @Get Get user attendance by id.
 * @permission [Admin]
 */
router.get(`${ApiUrl.listById}`, JWTAuth, attendanceController.getAttendanceById);

/**
 * @Post Add addendance 
 * @permission [Admin]
 */
router.post(`${ApiUrl.add}`, JWTAuth, attendanceController.addAddendance);

/**
 * @Update Update attendance by Id.
 * @permission [Admin]
 */
router.put(`${ApiUrl.updateById}`, JWTAuth, attendanceController.updateAttendanceById);

/**
 * @Delete Delete attendance by id.
 * @permission [Admin]
 */
router.delete(`${ApiUrl.deleteById}`, JWTAuth, attendanceController.deleteAttendanceById);

module.exports = router;