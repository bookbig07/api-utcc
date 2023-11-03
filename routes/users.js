const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require('../models/Users.js');
const SECRET = 'hvdvay6ert72839289aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?pou89ywe'

router.post("/register", async (req, res) => {
    const { email , password } = req.body;
    try {
        const userExists = await Users.findOne({ email });
        if (userExists) {
            console.log("Email already exists")
            return res.status(400).json({ message : "Email already exists" });
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({
            email,
            password: encryptedPassword
        });
        await newUser.save();
        res.status(201).json({ message : "Sign up for membership successfully." });
    } catch (error) {
        console.log(error);
    }
});

router.post("/login", async (req, res) => {
    const { email , password } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message : "Email Not Found" });
        }
        if (!user.active) {
            return res.status(403).json({ message : "Does not have access permissions" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const token = jwt.sign({ email: user.email }, SECRET , {
            expiresIn: "30m",
        });
        return res.status(200).json({ secret : token });
    } catch (error) {
        console.log(error);
    }
});


module.exports = router