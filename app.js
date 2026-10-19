// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.log('MongoDB connection error:', err.message));

const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});
const Employee = mongoose.model('Employee', employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below






//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
    }
});



//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: 'Invalid employee id', error: error.message });
    }
});




//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        const employee = new Employee({ name, location, position, salary });
        const saved = await employee.save();
        res.json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add employee', error: error.message });
    }
});





//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted', employee: deleted });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete employee', error: error.message });
    }
});





//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
// The id comes from the request body (_id) or, if given, from the URL.
const updateEmployee = async (req, res) => {
    try {
        const id = req.body._id || req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Employee id is required' });
        }
        const { name, location, position, salary } = req.body;
        const updated = await Employee.findByIdAndUpdate(
            id,
            { name, location, position, salary },
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update employee', error: error.message });
    }
};
app.put('/api/employeelist', updateEmployee);
app.put('/api/employeelist/:id', updateEmployee);


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


