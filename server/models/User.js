const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true, 
        minlength: 3,
        trim: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Vui lòng nhập email hợp lệ']
    },
    password: {
        type: String, 
        required: true, 
        minlength: 6 
    },
    roles: {
        type: [String], 
        default: ['User'], 
        enum: ['User', 'Admin']
    }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);