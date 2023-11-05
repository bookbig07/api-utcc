const express = require("express");
const router = express.Router();
const Course = require("../models/Course.js");

router.get("/", async (req, res, next) => {
  try {
    const courses = await Course.find().exec();
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

router.post("/addCompareSubject", async (req, res) => {
  try {
    const {
      course_code,
      course_name,
      course_credit,
      convert_code,
      convert_name,
      convert_credit,
      category,
    } = req.body;

    const checkSubjectExist = await Course.findOne({
      course_code: course_code,
    });
    if (checkSubjectExist) {
      res.status(400).send("Already have subject");
    }
    const addSubject = await Course.create({
      course_code,
      course_name,
      course_credit,
      convert_code,
      convert_name,
      convert_credit,
      category,
    });
    if (addSubject) {
      res.status(201).send("Created Subject to Compare Success");
    }
  } catch (error) {
    res.status(403).send({ error: error });
  }
});

router.post("/compare", async (req, res) => {
  try {
    const countSubject = Object.values(req.body).length;
    console.log(Object.values(req.body)[0]);
    let compareSubject = [];
    for (let i = 0; i < countSubject; i++) {
      const findSubjectToCompare = await Course.findOne({
        course_code: Object.values(req.body)[i],
      });

      if (findSubjectToCompare) {
        compareSubject.push(findSubjectToCompare);
      }
    }
    console.log(compareSubject);
  } catch (error) {
    res.status(403).send({ error: error });
  }
});

module.exports = router;
