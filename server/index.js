const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.js');
const employeeRouter = require('./routes/employee.js');
const cors = require('cors')

const app = express();

// Connect to MongoDB

mongoose.connect('mongodb://localhost:27017/employees')
 .then(() => console.log("MongoDB connected"))
 .catch(err => console.error(err));


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter)
app.use('/api/employee', employeeRouter)

app.get('/api', (req, res) => {
    res.send("API is running")
})

app.listen(3000, () => console.log("server listening on 3000"))