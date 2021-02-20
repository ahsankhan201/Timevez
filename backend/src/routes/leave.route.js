const express = require('express');
const router = express.Router();
const { leaveController } = require('../controllers');
const { ApiUrl } = require('../shared');
const { JWTAuth } = require('../middlewares');

/**
 * Add Leave Request.
 * @permission [Employee]
 */
router.post(`${ApiUrl.leaveRequest}`, JWTAuth, leaveController.AddleaveRequest)

/**
 * @Get Get Paged User Leaves By User Id.
 * @permission [Admin] [Employee]
 */
router.get(`${ApiUrl.pagedUserLeaves}`, JWTAuth, leaveController.GetPagedUserLeaves);

/**
 * @Get Get Leaves total count by user id.
 * @permission [Admin] [Employee]
 */
router.get(`${ApiUrl.totalCountByUserId}`, JWTAuth, leaveController.totalCountByUserId);

/**
 * @Get Get Leaves total count.
 * @permission [Admin]
 */
router.get(`${ApiUrl.totalCount}`, JWTAuth, leaveController.getTotalCount);

/**
 * @Get Get Paged Leave list against page number.
 * @permission [Admin]
 */
router.get(`${ApiUrl.pagedLeaves}`, JWTAuth, leaveController.GetPagedLeaves);

/**
 * @Get Get user Leave by id.
 * @permission [Admin]
 */
router.get(`${ApiUrl.listById}`, JWTAuth, leaveController.getLeaveById);

/**
 * @Post Add leave 
 * @permission [Admin]
 */
router.post(`${ApiUrl.add}`, JWTAuth, leaveController.addLeave);

/**
 * @Update Update Leave by Id.
 * @permission [Admin]
 */
router.put(`${ApiUrl.updateById}`, JWTAuth, leaveController.updateLeaveById);

/**
 * @Delete Delete Leave by id.
 * @permission [Admin]
 */
router.delete(`${ApiUrl.deleteById}`, JWTAuth, leaveController.deleteLeaveById);

module.exports = router;