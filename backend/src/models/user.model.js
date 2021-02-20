const mongoose = require('mongoose');

/** Define User model schema */
const userSchema = mongoose.Schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    phone: { type: String, require: true },
    email: { type: String, require: true },
    address: { type: String, require: true },
    CNIC: { type: String, require: true },
    createdAt: { type: Date },
    modifiedAt: { type: Date },
    active: { type: Boolean, require: true },
    photo: {type: String},
    role: { type: String, enum: ['Admin', 'Employee'], default: 'Employee' }
});

/** Exports User Schema model */
module.exports = mongoose.model('User', userSchema);