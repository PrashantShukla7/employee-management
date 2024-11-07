const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
    },
    email: {
        type: 'string',
        required: true,
        unique: true,  
    },
    mobile: {
        type: 'number',
        required: true,
        unique: true,
    },
    designation: {
        type: 'string',
        required: true,
    },
    gender: {
        type: 'string',
        required: true,
    },
    course: {
        type: 'array',
        required: true,
    },
    image: {
        type: 'string',
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Employees', employeeSchema)