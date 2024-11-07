const express = require("express");
const bcrypt = require("bcrypt");
const admin = require("../models/admin");
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const router = express.Router();


router.post("/logout", (req, res) => {
    res.clearCookie("access_token"); // Assuming the token is stored in a cookie
    return res.status(200).json({ message: "Logged out successfully" });
});

router.post("/register", async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    try {
        const newAdmin = new admin({
            username: req.body.username,
            password: hash,
        });
        const savedAdmin = await newAdmin.save();
        res.status(201).json({ savedAdmin });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/login", async (req, res) => {
    try {
        const newAdmin = await admin.findOne({ username: req.body.username });
        if (!newAdmin) return res.status(404).json({ message: "Admin not found" });
        const isMatch = await bcrypt.compare(req.body.password, newAdmin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });
        const token = jwt.sign({username: newAdmin.username, id: newAdmin._id}, process.env.JWT_SECRET)
        res.cookie("access_token", token, {httpOnly: true}).status(200).json({ message: "Logged in successful" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
