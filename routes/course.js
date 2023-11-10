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
      return res.status(400).send({ error: "Already have subject" });
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
    return res.status(403).send({ error: error });
  }
});

router.post("/compare", async (req, res) => {
  try {
    const countSubject = Object.values(req.body).length;
    // console.log(Object.values(req.body)[0]);
    let compareSubject = [];
    let compareDupicate = [];
    let CreditLessThan2 = [];

    for (let i = 0; i < countSubject; i++) {
      const findSubjectToCompare = await Course.findOne({
        course_code: Object.values(req.body)[i],
      });

      if (findSubjectToCompare) {
        if (findSubjectToCompare?.course_credit < 3) {
          CreditLessThan2.push(findSubjectToCompare);
        } else {
          if (findSubjectToCompare) {
            compareSubject.push(findSubjectToCompare);
          }
        }
      }
    }

    if (CreditLessThan2.length > 0) {
      let compareSuccess = false;
      for (let i = 0; i < CreditLessThan2.length; i++) {
        compareSuccess = false;
        for (let j = 1; j <= CreditLessThan2.length; j++) {
          console.log(
            CreditLessThan2[i]?.course_credit ===
              CreditLessThan2[j]?.course_credit
          );
          if (
            CreditLessThan2[i]?.course_credit ===
            CreditLessThan2[j]?.course_credit
          ) {
            compareSuccess = true;
          } else {
            compareSuccess = false;
          }
          if (compareSuccess) {
            compareDupicate.push(CreditLessThan2[i]);
          }
        }
      }
    }

    res
      .status(200)
      .send({ singleSubject: compareSubject, doubleSubject: compareDupicate });
  } catch (error) {
    return res.status(403).send({ error: error });
  }
});

module.exports = router;
