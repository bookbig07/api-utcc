const express = require("express");
const router = express.Router();
const Course = require("../models/Course.js");

router.get("/", async (req, res, next) => {
  try {
    const courses = await Course.find().exec();
    res.status(200).send({
      courses : courses,
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({ error: error });
  }
});

router.post("/addCompareSubject", async (req, res) => {
  try {
    const {
      coursecode,
      coursename,
      coursecredit,
      convertcode,
      convertname,
      convertcredit,
      category,
    } = req.body;

    const checkSubjectExist = await Course.findOne({
      course_code: coursecode,
    });
    if (checkSubjectExist) {
      return res.status(400).send("Already have subject");
    }
    const addSubject = await Course.create({
      course_code: coursecode,
      course_name: coursename,
      course_credit: coursecredit,
      convert_code: convertcode,
      convert_name: convertname,
      convert_credit: convertcredit,
      category,
    });
    if (addSubject) {
      res.status(201).send("Created Subject to Compare Success");
    }
  } catch (error) {
    res.status(403).send({ error: error });
  }
});

router.delete("/deleteCompareSubject", async (req, res) => {
  try {
    const {
      indexCourse,
    } = req.body;

    const checkSubjectExist = await Course.findById(indexCourse);
    if (!checkSubjectExist) {
      return res.status(404).send("Subject not found");
    }

    await Course.findByIdAndDelete(indexCourse);

    res.status(200).send("Deleted Subject from Comparison Success");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/editCompareSubject", async (req, res) => {
  try {
    const {
      indexCourse,
      coursecode,
      coursename,
      coursecredit,
      convertcode,
      convertname,
      convertcredit,
      category,
    } = req.body;
    const existingSubject = await Course.findOne({ _id: indexCourse });
    if (!existingSubject) {
      return res.status(404).send("Subject not found");
    }
    existingSubject.course_code = coursecode;
    existingSubject.course_name = coursename;
    existingSubject.course_credit = coursecredit;
    existingSubject.convert_code = convertcode;
    existingSubject.convert_name = convertname;
    existingSubject.convert_credit = convertcredit;
    existingSubject.category = category;
    await existingSubject.save();
    res.status(200).send("Subject updated successfully");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.post("/compare", async (req, res) => {
  try {
    const countSubject = Object.values(req.body).length;

    let generalSubject = [];
    let lessThan2 = [];
    let notCompare = [];
    let dupicateCompare = [];

    for (let i = 0; i < countSubject; i++) {
      const findSubjectToCompare = await Course.findOne({
        course_code: Object.values(req.body)[i],
      });
      if (findSubjectToCompare?.course_credit < 3) {
        lessThan2.push(findSubjectToCompare);
      } else if (findSubjectToCompare !== null) {
        generalSubject.push(findSubjectToCompare);
      } else {
        notCompare.push({
          course_code: Object.values(req.body)[i],
          desc: "รายวิชานี้ไม่มีในข้อมูล",
        });
      }
    }
    if (lessThan2.length > 0) {
      for (let i = 0; i < lessThan2.length; i++) {
        let successCompare = false;
        for (let j = 0; j < lessThan2.length; j++) {
          if (
            lessThan2[i].convert_code === lessThan2[j].convert_code &&
            lessThan2[i].course_code !== lessThan2[j].course_code
          ) {
            successCompare = true;
          }
        }
        if (successCompare) {
          dupicateCompare.push(lessThan2[i]);
        } else {
          notCompare.push(lessThan2[i]);
        }
      }
    }
    let CopygeneralSubject = [...generalSubject];
    for (let i = 0; i < generalSubject.length; i++) {
      for (let j = 0; j < CopygeneralSubject.length; j++) {
        if (
          i !== j &&
          generalSubject[i].convert_code === CopygeneralSubject[j].convert_code
        ) {
          dupicateCompare.push(generalSubject[i]);
          break;
        }
      }
    }
    generalSubject = generalSubject.filter((item) => {
      return !dupicateCompare.some(
        (duplicate) => duplicate.convert_code === item.convert_code
      );
    });
    const groups = dupicateCompare.reduce((groups, item, index) => {
      const group = groups[item.convert_code] || [];
      group.push(item);
      groups[item.convert_code] = group;
      return groups;
    }, {});
    res.status(200).send({
      general: generalSubject,
      dupicate: [groups],
      notCompare: notCompare,
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({ error: error });
  }
});

module.exports = router;
