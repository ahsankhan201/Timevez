const { Leave } = require('../models');
const { sharedUtil } = require('../shared');
const { success, exception } = require('../responses');

/**
 * Get paged user leave list for pagination.
 */
exports.GetPagedLeaves = (req, res) => {
    const { pageNo, type, fromDate, toDate } = req.query;

    const options = {
        "skip": 10 * (pageNo - 1), // Skip records.
        "limit": 10, // Page size.
        "sort": { fromDate: 1 } // Sort based on ascending date.
    }

    /** Get from date and to date via filter type */
    const timeRange = sharedUtil.getTimeFilter(type, fromDate, toDate);

    const query = {
        $and: [
            { fromDate: { '$gte': timeRange.startDate, '$lte': timeRange.endDate } },
            { toDate: { '$gte': timeRange.startDate, '$lte': timeRange.endDate } },
        ]
    }

    Leave.find(query).countDocuments().then(totatCount => {
        Leave.find(query, {}, options)
            .populate('user', ['firstname', 'lastname'])
            .then(leaveList => {
                if (!leaveList) {
                    return exception(res, 404);
                }

                return success(res, { data: leaveList, total: totatCount });
            }).catch(error => {
                return exception(res, 500);
            });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
 * Get Leave by id.
 */
exports.getLeaveById = (req, res) => {
    const { id } = req.params;

    Leave.findOne({ _id: id })
        .populate('user', ['firstname', 'lastname']).then(leave => {

            if (!leave) {
                return exception(res, 404);
            }

            const data = {
                "_id": leave._id,
                "type": leave.type,
                "status": leave.status,
                "fromDate": new Date(leave.fromDate),
                "toDate": new Date(leave.toDate),
                "description": leave.description,
                "userId": leave.user._id,
            }

            return success(res, data);
        }).catch(error => {
            return exception(res, 500);
        });
}

/**
* Add Request for leave.
*/
exports.AddleaveRequest = (req, res) => {
    const { userId } = req.userData;
    const { fromDate, toDate, type, description } = req.body;

    var startDate = sharedUtil.setZeroHours(fromDate);
    var endDate = sharedUtil.setZeroHours(toDate);

    const query = {
        $and: [
            { user: userId },
            {
                $or: [
                    { fromDate: { '$gte': startDate, '$lte': endDate } },
                    { toDate: { '$gte': startDate, '$lte': endDate } },
                ]
            }
        ]
    }

    Leave.find(query).countDocuments().then(totatCount => {
        if (totatCount) {
            return exception(res, 400, `Record already exists between ${startDate}-${endDate}`);
        }

        const leave = new Leave({
            fromDate: startDate,
            toDate: endDate,
            type: type,
            description: description,
            user: userId
        });

        leave.save().then(addedRequest => {
            if (!addedRequest) {
                return exception(res, 500);
            }

            return success(res, addedRequest);
        }).catch(error => {
            return exception(res, 500);
        });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
 * Get Paged Leaves for a specific user.
 */
exports.GetPagedUserLeaves = (req, res) => {
    const { userId, pageNo, type, fromDate, toDate, limit } = req.query;

    const options = {
        "skip": 10 * (pageNo - 1),
        "limit": Number(limit),
        "sort": { fromDate: -1 }
    }

    // Get all records that are >= today.
    var query = {
        $and: [
            { user: userId },
            {
                $or: [
                    { fromDate: { '$gte': new Date() } },
                    { toDate: { '$gte': new Date() } },
                ]
            }
        ]
    }

    // Get all records between two dates.
    if (type !== 'future') {
        const timeRange = sharedUtil.getTimeFilter(type, fromDate, toDate);

        query = {
            $and: [
                { user: userId },
                {
                    $or: [
                        { fromDate: { '$gte': timeRange.startDate, '$lte': timeRange.endDate } },
                        { toDate: { '$gte': timeRange.startDate, '$lte': timeRange.endDate } },
                    ]
                }
            ]
        }
    }

    Leave.find(query).countDocuments().then(totatCount => {
        Leave.find(query, {}, options).then(leaveList => {
            if (!leaveList) {
                return exception(res, 404);
            }

            return success(res, { data: leaveList, total: totatCount });
        }).catch(error => {
            return exception(res, 500);
        });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
* Add Leave for a specific user.
*/
exports.addLeave = (req, res) => {
    const { fromDate, toDate, type, description, status, userId } = req.body;

    var startDate = sharedUtil.setZeroHours(fromDate);
    var endDate = sharedUtil.setZeroHours(toDate);

    const query = {
        $and: [
            { user: userId },
            {
                $or: [
                    { fromDate: { '$gte': startDate, '$lte': endDate } },
                    { toDate: { '$gte': startDate, '$lte': endDate } },
                ]
            }
        ]
    }

    Leave.findOne(query).countDocuments().then(totatCount => {
        if (totatCount) {
            return exception(res, 400, `Record already exists between ${fromDate}-${toDate}`);
        }

        const leave = new Leave({
            fromDate: startDate,
            toDate: endDate,
            type: type,
            description: description,
            status: status,
            user: userId
        });

        leave.save().then(createdLeave => {
            if (!createdLeave) {
                return exception(res, 500);
            }

            return success(res, createdLeave);
        }).catch(error => {
            return exception(res, 500);
        });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
* Update Leave against id.
*/
exports.updateLeaveById = (req, res) => {
    const { id } = req.params;
    const { fromDate, toDate, type, description, status, userId } = req.body;

    var startDate = sharedUtil.setZeroHours(fromDate);
    var endDate = sharedUtil.setZeroHours(toDate);

    const query = {
        $and: [
            { _id: { '$ne': id } },
            { user: userId },
            {
                $or: [
                    { fromDate: { '$gte': startDate, '$lte': endDate } },
                    { toDate: { '$gte': startDate, '$lte': endDate } },
                ]
            }
        ]
    }

    Leave.findOne(query).countDocuments().then(totatCount => {
        if (totatCount) {
            return exception(res, 400, `Record already exists between ${fromDate}-${toDate}`);
        }

        Leave.findOneAndUpdate({ _id: id }, {
            $set: {
                fromDate: startDate,
                toDate: endDate,
                type: type,
                description: description,
                status: status,
                user: userId
            }
        }).then(updatedLeave => {
            if (!updatedLeave) {
                return exception(res, 404);
            }

            return success(res, updatedLeave);
        }).catch(error => {
            return exception(res, 500);
        });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
 * Get leaves total count.
 */
exports.getTotalCount = (req, res) => {
    const { status, type, fromDate, toDate } = req.query;
    const timeRange = sharedUtil.getTimeFilter(type, fromDate, toDate);

    const query = {
        $and: [
            { "status": status },
            { fromDate: { '$gte': timeRange.startDate } },
            { toDate: { '$lte': timeRange.endDate } },
        ]
    }

    Leave.find(query).countDocuments().then(totatCount => {
        return success(res, { total: totatCount });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
* Get leaves total count.
*/
exports.totalCountByUserId = (req, res) => {
    const { userId, status, type, fromDate, toDate } = req.query;
    const timeRange = sharedUtil.getTimeFilter(type, fromDate, toDate);

    const query = {
        $and: [
            { "user": userId },
            { "status": status },
            { fromDate: { '$gte': timeRange.startDate, '$lte': timeRange.endDate } },
            { toDate: { '$gte': timeRange.startDate, '$lte': timeRange.endDate } },
        ]
    }

    Leave.find(query).countDocuments().then(totatCount => {
        return success(res, { total: totatCount });
    }).catch(error => {
        return exception(res, 500);
    });
}

/**
* Delete Leave against id.
*/
exports.deleteLeaveById = (req, res) => {
    const { id } = req.params;

    Leave.findOneAndDelete({ _id: id }).then(deletedLeave => {
        if (!deletedLeave) {
            return exception(res, 404);
        }

        return success(res, deletedLeave);
    }).catch(error => {
        return exception(res, 500);
    });
}
