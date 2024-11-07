const express = require('express')
const employee = require('../models/employee.js');

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const employees = await employee.find();
        res.status(200).json(employees)
    } catch (err) {
        
    }
})

router.get('/:id', async (req, res) => {
    try {
        const foundEmployee = await employee.findById(req.params.id);
        res.status(200).json(foundEmployee)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.post('/', async (req, res) => {
    try {
        var employeeExists = await employee.findOne({ email: req.body.email })
        if (employeeExists) {
            return res.status(400).json({ message: 'Employee already exists with this email' })
        }
        employeeExists = await employee.findOne({ mobile: req.body.mobile })
        if (employeeExists) {
            return res.status(400).json({ message: 'Employee already exists with this mobile number' })
        }
        const newEmployee = await new employee(req.body)
        const result = await newEmployee.save()
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const newemployee = await employee.findOneAndUpdate({ _id: req.params.id}, req.body)
        await newemployee.save();
        res.status(200).json({ message: "Employee Updated" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedEmployee = await employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' })
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;