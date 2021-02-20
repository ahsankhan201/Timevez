const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { ApiUrl } = require('../shared');
const { JWTAuth } = require('../middlewares');

/**
 * @Post Login user
 * @permission [public]
 */
router.post(`${ApiUrl.login}`,JWTAuth, userController.userLogin);

/**
 * @Update Change password
 * @permission [Admin] [Employee]
 */
router.put(`${ApiUrl.changePassword}`, JWTAuth, userController.changePassword);

/**
 * Upload user photo.
 */
router.put(`${ApiUrl.uploadPhotoById}`, JWTAuth, userController.uploadPhoto);

/**
 * @Get Get user list.
 * @permission [Admin] 
 */
router.get(`${ApiUrl.list}`, JWTAuth, userController.getUsers);

/**
 * @Get Get user list by id.
 * @permission [Admin]
 */
router.get(`${ApiUrl.listById}`, JWTAuth, userController.getUsersById);

/**
 * @Get Get Paged Users.
 * @permission [Admin]
 */
router.get(`${ApiUrl.pagedUsers}`, JWTAuth, userController.GetPagedUsers);

/**
 * @Get Get users total count.
 * @permission [Admin]
 */
router.get(`${ApiUrl.totalCount}`, JWTAuth, userController.getTotalCount);

/**
 * @Post Register new user
 * @permission [Admin]
 */
router.post(`${ApiUrl.register}`, JWTAuth, userController.registerUser);

/**
 * @Update Update user by id.
 * @permission [Admin]
 */
router.put(`${ApiUrl.updateById}`, JWTAuth, userController.updateUserById);

/**
 * @Delete Delete user by id.
 * @permission [Admin]
 */
router.delete(`${ApiUrl.deleteById}`, JWTAuth, userController.deleteUserById);

module.exports = router;