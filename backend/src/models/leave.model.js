const mongoose = require('mongoose');

/** Define Leave model schema */
const leaveSchema = mongoose.Schema({
    fromDate: { type: Date, require: true },
    toDate: { type: Date, require: true },
    type: { type: String, enum: ['annual', 'casual'], default: 'casual' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    description: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
});

/** Exports Leave Schema model */
module.exports = mongoose.model('Leave', leaveSchema);