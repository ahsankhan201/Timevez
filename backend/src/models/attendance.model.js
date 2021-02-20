const mongoose = require('mongoose');

/** Define Attendance model schema */
const attendanceSchema = mongoose.Schema({
    checkIn: { type: Date, require: true },
    checkOut: { type: Date },
    breakStartTime: { type: Date },
    breakEndTime: { type: Date },
    date: { type: Date, require: true },
    active: { type: Boolean, require: true },
    comment: { type: String },
    checkInIp: { type: String, require: true },
    checkOutIp: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
});

/** Exports Attendance Schema model */
module.exports = mongoose.model('Attendance', attendanceSchema);