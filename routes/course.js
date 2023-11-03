const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course.js');

router.get('/', async (req, res, next) => {
    try {
        const courses = await Course.find().exec();
        res.json(courses);
    } catch (error) {
        next(error);
    }
});

module.exports = router