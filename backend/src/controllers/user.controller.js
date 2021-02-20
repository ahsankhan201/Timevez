const jwt = require("jsonwebtoken"); // import token for user login.
const bcrypt = require("bcryptjs"); // import bcrypt to hash password.
const { User } = require('../models');
const { jwt_secret_key } = require('../config');
const { sharedUtil } = require('../shared');
const { success, exception } = require('../responses');

/**
 * Register new user
 */
exports.registerUser = (req, res) => {
    console.log('user register=', req.body);
    const { password, username, firstname, lastname, phone, email, address, CNIC, active, photo } = req.body;
    bcrypt.hash(password, 10).then(hashPassowrd => {
        const user = new User({
            username: username,
            password: hashPassowrd,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            email: email,
            photo: photo,
            address: address,
            CNIC: CNIC,
            active: active,
            createdAt: new Date()
        });
        

        user.save().then(registeredUser => {
            if (!registeredUser) {
                return exception(res, 500);
            }

            return success(res, { _id: registeredUser._id, username: username, firstname: firstname, lastname: lastname });
        }).catch(error => {
            if (error.code === 11000) {
                return exception(res, 400, 'Username must be unique');
            }

            return exception(res, 500);
        });
    });
}

/**
 * Upload user photo.
 */
exports.uploadPhoto = (req, res) => {
    const { id } = req.params;
    const { photo } = req.body;
    
    User.findOneAndUpdate({ _id: id }, {
        $set: {
            photo: photo
        }
    }).then(updatedUser => {
        return success(res, { message: 'Photo Uploaded Successfully'});
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
 * Login user.
 */
exports.userLogin = (req, res) => {
    const { username, password } = req.body;
console.log('userBody=', req.body);
    User.findOne({ username: username }).then(user => {
        console.log('user Login', user);
        if (!user) {
            return exception(res, 404, 'Username does not exists');
        }

        if (!user.active) {
            return exception(res, 401, 'Inactive User');
        }

        const isPasswordMatched = bcrypt.compareSync(password, user.password);

        if (!isPasswordMatched) {
            return exception(res, 401, 'Incorrect Password');
        }

        /** Set user info in encripted form and generate new token. */
        const token = jwt.sign({ username: username, userId: user._id, role: user.role }, jwt_secret_key, { expiresIn: '1 days' });

        return success(res, {
            username: user.username,
            userId: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            // photo: user.photo,
            role: user.role,
            token: token,
            expiresIn: 3600
        });

    }).catch(error => {
        return exception(res, 500);
    });
}

/**
 * Change user password.
 */
exports.changePassword = (req, res) => {
    const { username } = req.userData;
    const { oldPassword, password } = req.body;

    User.findOne({ username: username }).then(user => {
        if (!user) {
            return exception(res, 404, 'Username does not exists.');
        }

        if (!user.active) {
            return exception(res, 401, 'Inactive User');
        }

        const isPasswordMatched = bcrypt.compareSync(oldPassword, user.password);

        if (!isPasswordMatched) {
            return exception(res, 401, 'Invalid old Password');
        }

        bcrypt.hash(password, 10).then(hashPassowrd => {
            User.findOneAndUpdate({ username: username }, {
                $set: {
                    password: hashPassowrd,
                    modifiedAt: new Date()
                }
            }).then(updatedUser => {
                return success(res, { message: 'Password changed Successfully' });
            }).catch(error => {
                return exception(res, 500);
            });
        });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
 * Get employee list.
 * Get all username, role and password.
 */
exports.getUsers = (req, res) => {
    User.find({ role: 'Employee' }, ['username', 'firstname', 'lastname', 'phone', 'email', 'address', 'CNIC', 'active', 'role', 'modifiedAt', 'createdAt', 'photo'])
        .then(userList => {
            if (!userList) {
                return exception(res, 404);
            }

            return success(res, userList);
        }).catch(error => {
            return exception(res, 500);
        });
}

/**
 * Get pages users list for pagination.
 * Get result based on filters
 */
exports.GetPagedUsers = (req, res) => {
    const { pageNo, search } = req.query;

    const fields = ['username', 'firstname', 'lastname', 'phone', 'email', 'address', 'CNIC', 'active', 'role', 'modifiedAt', 'createdAt', 'photo'];
    const options = {
        "skip": 10 * (pageNo - 1), // Skip records.
        "limit": 10, // Page size.
        "sort": { firstname: 1 } // Sort based on ascending firsname.
    }

    let query = {}

    if (search && search.length) {
        regex = new RegExp(search);
        query = {
            $and: [
                {
                    $or: [
                        { firstname: regex },
                        { lastname: regex },
                        // { address: regex },
                        // { username: regex },
                    ]
                },
                {
                    role: 'Employee'
                }
            ]
        }
    }

    User.find(query).countDocuments().then(totatCount => {
        User.find(query, fields, options)
            .then(userList => {
                if (!userList) {
                    return exception(res, 404);
                }

                return success(res, { data: userList, total: totatCount });
            }).catch(error => {
                return exception(res, 500);
            });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
 * Get user by id.
 */
exports.getUsersById = (req, res) => {
    const { id } = req.params;

    User.findOne({ _id: id }, ['username', 'firstname', 'lastname', 'phone', 'email', 'address', 'CNIC', 'active', 'role', 'photo'])
        .then(user => {
            if (!user) {
                return exception(res, 404);
            }

            return success(res, user);
        }).catch(error => {
            return exception(res, 500);
        });
}

/**
* Update User against user id.
*/
exports.updateUserById = (req, res) => {
    const { id } = req.params;
    const { username, firstname, lastname, phone, email, address, CNIC, active, password, photo } = req.body;

    var updatedValues = {
            $set: {
                username: username,
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                email: email,
                address: address,
                CNIC: CNIC,
                photo: photo,
                active: active,
                modifiedAt: new Date()
            }
        }
    
        if (password) {
            bcrypt.hash(password, 10).then(hashPassowrd => {
            updatedValues = {
                $set: {
                    password: hashPassowrd,
                    modifiedAt: new Date()
                }
            }
        });
        }

        User.findOneAndUpdate({ _id: id }, updatedValues).then(updatedUser => {
            if (!updatedUser) {
                return exception(res, 404);
            }

            return success(res, updatedUser);
        }).catch(error => {
            if (error.code === 11000) {
                return exception(res, 400, 'Username must be unique');
            }

            return exception(res, 500);
        });
    
}

/**
 * Get users total count.
 */
exports.getTotalCount = (req, res) => {
    const { type, toDate } = req.query;
    const timeRange = sharedUtil.getTimeFilter(type, null, toDate);

    const query = {
        $and: [
            { "role": 'Employee' },
            { "active": true },
            { "createdAt": { '$lte': timeRange.endDate } }
        ]
    }

    User.find(query).countDocuments().then(totatCount => {
        return success(res, { total: totatCount });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
* Delete User against user id.
*/
exports.deleteUserById = (req, res) => {
    const { id } = req.params;

    User.findOneAndDelete({ _id: id }).then(deletedUser => {
        if (!deletedUser) {
            return exception(res, 404);
        }

        return success(res, deletedUser);
    }).catch(error => {
        return exception(res, 500);
    });
}
