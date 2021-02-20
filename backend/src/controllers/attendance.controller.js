const { Attendance } = require('../models');
const { sharedUtil } = require('../shared');
const { success, exception } = require('../responses');

/**
 * Get paged user attendance list for pagination.
 */
exports.GetPagedAttendances = (req, res) => {
    const { pageNo, type, fromDate, toDate } = req.query;
    const options = {
        "skip": 10 * (pageNo - 1), // Skip records.
        "limit": 10, // Page size.
        "sort": { date: 1 } // Sort based on ascending date.
    }

    /** Get from date and to date via filter type */
    const timeRange = sharedUtil.getTimeFilter(type, fromDate, toDate);

    const query = {
        "date": { '$gte': timeRange.startDate, '$lte': timeRange.endDate }
    }

    Attendance.find(query).countDocuments().then(totatCount => {
        Attendance.find(query, {}, options)
            .populate('user', ['firstname', 'lastname'])
            .then(attendanceList => {
                if (!attendanceList) {
                    return exception(res, 404);
                }

                return success(res, { data: attendanceList, total: totatCount });
            }).catch(error => {
                return exception(res, 500);
            });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
 * Get Attendance by id.
 */
exports.getAttendanceById = (req, res) => {
    const { id } = req.params;

    Attendance.findOne({ _id: id })
        .populate('user', ['username', 'firstname', 'lastname', 'phone', 'email', 'address', 'CNIC', 'active'])
        .then(attendance => {
            if (!attendance) {
                return exception(res, 404);
            }

            const data = {
                "_id": attendance._id,
                "checkIn": attendance.checkIn,
                "checkOut": attendance.checkOut,
                "breakStartTime": attendance.breakStartTime,
                "breakEndTime": attendance.breakEndTime,
                "date": new Date(attendance.date),
                "active": attendance.active,
                "comment": attendance.comment,
                "userId": attendance.user._id,
                "firstname": attendance.firstname,
                "lastname": attendance.lastname
            }

            return success(res, data);
        }).catch(error => {
            return exception(res, 500);
        });
}

/**
 * Get Paged Attendances for a specific user.
 */
exports.GetPagedUserAttendances = (req, res) => {
    const { userId, pageNo, type, fromDate, toDate } = req.query;
    const timeRange = sharedUtil.getTimeFilter(type, fromDate, toDate);

    const options = {
        "skip": 10 * (pageNo - 1),
        "limit": 10,
        "sort": { date: -1 }
    }

    const query = {
        $and: [
            { user: userId },
            { "date": { '$gte': timeRange.startDate, '$lte': timeRange.endDate } }
        ]
    }

    Attendance.find(query).countDocuments().then(totatCount => {
        Attendance.find(query, {}, options).then(attendanceList => {
            if (!attendanceList) {
                return exception(res, 404);
            }

            return success(res, { data: attendanceList, total: totatCount });
        }).catch(error => {
            return exception(res, 500);
        });
    }).catch(error => {
        return exception(res, 500);
    });
}

// exports.totalCountByUserId = (req, res) => {
//     const { userId, active, type, fromDate, toDate } = req.query;
//     const timeRange = sharedUtil.getTimeFilter(type, fromDate, toDate);

//     var query = {
//         $and: [
//             { "user": userId },
//             { "active": active },
//             { "checkIn": { '$gte': timeRange.startDate, '$lte': timeRange.endDate } }
//         ]
//     }

//     if(active === 'undefined') {
//         query = {
//             $and: [
//                 { "user": userId },
//                 { "checkIn": { '$gte': timeRange.startDate, '$lte': timeRange.endDate } }
//             ]
//         }
//     }

//     Attendance.find(query).countDocuments().then(totatCount => {
//         return success(res, { total: totatCount });
//     }).catch(error => {
//         return exception(res, 500);
//     });
// }

/**
* Add Attendance.
*/
exports.addAddendance = (req, res) => {
    const { checkIn, checkOut, breakStartTime, breakEndTime, date, active, comment, userId } = req.body;
    var attendanceDate = sharedUtil.setZeroHours(date);

    Attendance.findOne({ date: attendanceDate, user: userId }).countDocuments().then(totatCount => {
        if (totatCount) {
            return exception(res, 400, `Already record added for date: ${date}`);
        }

        // Check either attendance date is greater than current date or not.
        var currentDate = new Date();
        currentDate = sharedUtil.setZeroHours(currentDate);


        if (attendanceDate.getTime() > currentDate.getTime()) {
            return exception(res, 400, `Attendance date: ${attendanceDate} cannot be greater than current date`);
        }

        const attendance = new Attendance({
            checkIn: checkIn,
            checkOut: checkOut,
            breakStartTime: breakStartTime,
            breakEndTime: breakEndTime,
            date: attendanceDate,
            active: active,
            comment: comment,
            user: userId
        });

        attendance.save().then(createdAttendance => {
            if (!createdAttendance) {
                return exception(res, 500);
            }

            return success(res, createdAttendance);
        }).catch(error => {
            return exception(res, 500);
        })
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
* Update Attendance against id.
*/
exports.updateAttendanceById = (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, breakStartTime, breakEndTime, date: date, active, comment, userId } = req.body;
    var attendanceDate = sharedUtil.setZeroHours(date);

    const query = {
        $and: [
            { _id: { '$ne': id } },
            { user: userId },
            { date: attendanceDate }
        ]
    }

    Attendance.findOne(query).countDocuments().then(totatCount => {
        if (totatCount) {
            return exception(res, 400, `Record already exists for Date: ${attendanceDate}`);
        }

        // Check either attendance date is greater than current date or not.
        var currentDate = new Date();
        currentDate = sharedUtil.setZeroHours(currentDate);

        if (attendanceDate.getTime() > currentDate.getTime()) {
            return exception(res, 400, `Attendance date: ${attendanceDate} cannot be greater than current date`);
        }

        Attendance.findOneAndUpdate({ _id: id }, {
            $set: {
                checkIn: checkIn,
                checkOut: checkOut,
                breakStartTime: breakStartTime,
                breakEndTime: breakEndTime,
                active: active,
                comment: comment,
                user: userId,
                date: attendanceDate
            }
        }).then(updatedAttendance => {
            if (!updatedAttendance) {
                return exception(res, 404);
            }

            return success(res, updatedAttendance);
        }).catch(error => {
            return exception(res, 500);
        });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
* Find either already CheckIn or not, if not already CheckedIn then CheckIn user.
*/
exports.CheckIn = (req, res) => {
    const { userId } = req.userData;
    const todayDate = getCurrentDate();
    var attendanceDate = sharedUtil.setZeroHours(todayDate);

    Attendance.findOne({ "date": todayDate, "user": userId }).countDocuments().then(totatCount => {
        if (totatCount) {
            return exception(res, 400, `Already Checked in for Date: ${todayDate}`);
        }

        const attendance = new Attendance({
            checkIn: new Date(),
            date: attendanceDate,
            active: true,
            user: userId
        });

        attendance.save().then(createdAttendance => {
            if (!createdAttendance) {
                return exception(res, 500);
            }

            // createdAttendance.checkIn = new Date(createdAttendance.checkIn).toLocaleString();

            return success(res, createdAttendance);
        }).catch(error => {
            return exception(res, 500);
        });
    });
}

/**
* Find either already break started or not, if not then start break of user.
*/
exports.startBreak = (req, res) => {
    const { userId } = req.userData;
    const todayDate = getCurrentDate();
    var attendanceDate = sharedUtil.setZeroHours(todayDate);

    Attendance.findOne({ date: attendanceDate, user: userId }).then(currentAttendance => {

        if (!currentAttendance || (currentAttendance && !currentAttendance.checkIn)) {
            return exception(res, 400, 'not checked in ');
        }

        if (currentAttendance.checkOut) {
            return exception(res, 400, 'Already checked out');
        }

        if (currentAttendance.breakEndTime) {
            return exception(res, 400, 'Already break ended');
        }

        if (currentAttendance.breakStartTime) {
            return exception(res, 400, 'Already break started');
        }

        Attendance.findOneAndUpdate({ date: attendanceDate, user: userId }, {
            $set: {
                breakStartTime: new Date(),
            }
        }).then(updatedAttendance => {
            if (!updatedAttendance) {
                return exception(res, 404);
            }

            return success(res, updatedAttendance);
        }).catch(error => {
            return exception(res, 500);
        });
    });
}

/**
* Find either already CheckedIn or not, if already CheckIn then CheckOut user.
*/
exports.endBreak = (req, res) => {
    const { userId } = req.userData;
    const todayDate = getCurrentDate();
    var attendanceDate = sharedUtil.setZeroHours(todayDate);


    Attendance.findOne({ date: attendanceDate, user: userId }).then(currentAttendance => {

        if (!currentAttendance || (currentAttendance && !currentAttendance.checkIn)) {
            return exception(res, 400, 'not checked in ');
        }

        if (currentAttendance.checkOut) {
            return exception(res, 400, 'Already checked out');
        }

        if (!currentAttendance.breakStartTime) {
            return exception(res, 400, 'Break not started');
        }

        if (currentAttendance.breakEndTime) {
            return exception(res, 400, 'Already break ended');
        }

        Attendance.findOneAndUpdate({ date: attendanceDate, user: userId }, {
            $set: {
                breakEndTime: new Date()
            }
        }).then(updatedAttendance => {
            if (!updatedAttendance) {
                return exception(res, 404);
            }

            return success(res, updatedAttendance);
        }).catch(error => {
            return exception(res, 500);
        });
    });
}

/**
* Find either already Check-out or not, if already Checked-out then check-out user.
*/
exports.CheckOut = (req, res) => {
    const { userId } = req.userData;
    const { comment } = req.body;
    const todayDate = getCurrentDate();
    const yesterdayDate = getYesterdayDate();
    var attendanceDate = sharedUtil.setZeroHours(todayDate);
    var yesterdayAttendanceDate = sharedUtil.setZeroHours(yesterdayDate);

    query = {
        $and: [
            {
                $or: [
                    { 'date': attendanceDate },
                    { 'date': yesterdayAttendanceDate }
                ]
            },
            {
                'user': userId
            }
        ]
    }

    Attendance.find(query).then(attendances => {
       var currentAttendance = attendances.find(x =>  x.date >= attendanceDate);

        if (currentAttendance) {
            if (!currentAttendance.checkIn) {
                return exception(res, 400, `not checked in for date: ${currentAttendance.date}`);
            }

            if (currentAttendance.checkOut) {
                return exception(res, 400, `already checked out for date: ${currentAttendance.date}`);
            } else {
                const query = { date: attendanceDate, user: userId }
                const data = { checkOut: new Date(), comment: comment }

                updateData(res, query, data);
            }
        } else {
            currentAttendance = attendances.find(x => x.date >= yesterdayAttendanceDate);

            if (!currentAttendance || (currentAttendance && !currentAttendance.checkIn)) {
                return exception(res, 400, `not check in for date: ${currentAttendance.date}`);
            }

            if (currentAttendance.checkOut) {
                return exception(res, 400, `already checked out for date: ${currentAttendance.date}`);
            } else {
                const query = { date: yesterdayAttendanceDate, user: userId }
                const data = { checkOut: new Date(), comment: comment }

                updateData(res, query, data);
            }
        }
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
 * Get present employees total count.
 */
exports.getTotalCount = (req, res) => {
    const { type, fromDate, toDate } = req.query;
    const timeRange = sharedUtil.getTimeFilter(type, fromDate, toDate);

    const query = {
        $and: [
            { "role": 'Employee' },
            { "active": true },
            { "date": { '$gte': timeRange.startDate, '$lte': timeRange.endDate } }
        ]
    }

    Attendance.find()
        .populate('user', ['username', 'firstname', 'lastname', 'phone', 'email', 'address', 'CNIC', 'active', 'role'])
        .countDocuments()
        .then(totatCount => {
            return success(res, { total: totatCount });
        }).catch(error => {
            return exception(res, 500);
        });
}

/**
* Get present/absent total count for a specific user.
* 1) If active = true, gets present count 2) If active = false, gets absent count 3) If active is undefined, gets both present and absent count.
*/
exports.totalCountByUserId = (req, res) => {
    const { userId, active, type, fromDate, toDate } = req.query;
    const timeRange = sharedUtil.getTimeFilter(type, fromDate, toDate);

    var query = {
        $and: [
            { "user": userId },
            { "active": active },
            { "date": { '$gte': timeRange.startDate, '$lte': timeRange.endDate } }
        ]
    }

    if(active === 'undefined') {
        query = {
            $and: [
                { "user": userId },
                { "date": { '$gte': timeRange.startDate, '$lte': timeRange.endDate } }
            ]
        }
    }

    Attendance.find(query).countDocuments().then(totatCount => {
        return success(res, { total: totatCount });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
* Delete Attendance against id.
*/
exports.deleteAttendanceById = (req, res) => {
    const { id } = req.params;

    Attendance.findOneAndDelete({ _id: id }).then(deletedAttendance => {
        if (!deletedAttendance) {
            return exception(res, 404);
        }

        return success(res, deletedAttendance);
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
 * Get current date in format ("m/dd/yyyy") 
 */
getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
}

/**
 * Get yesterday date in format ("m/dd/yyyy") 
 */
getYesterdayDate = () => {
    const today = new Date();
    const yesterday = new Date(today)

    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
}

/**
 * Update Attendance
 * @param res
 * @param query Query to search data
 * @param data Date to be updated
 */
updateData = (res, query, data) => {
    Attendance.findOneAndUpdate(query, {
        $set: data
    }).then(updatedData => {
        if (!updatedData) {
            return exception(res, 404);
        }

        return success(res, updatedData);
    }).catch(error => {
        return exception(res, 500);
    });
}
