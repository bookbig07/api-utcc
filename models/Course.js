const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    course_credit : {
        type: Number,
        required: true
    },
    convert_code: {
        type: String,
        required: true
    },
    convert_name: {
        type: String,
        required: true
    },
    convert_credit : {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Course', CourseSchema)