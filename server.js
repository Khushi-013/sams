const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample data (replace with database)
let attendanceData = [];

// Route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Attendance Management System!');
});

// Route to create attendance record
app.post('/attendance', (req, res) => {
    const { date, studentName } = req.body;
    if (!date || !studentName) {
        return res.status(400).json({ message: 'Date and student name are required' });
    }
    attendanceData.push({ date, studentName });
    res.status(201).json({ message: 'Attendance record created', attendance: { date, studentName } });
});

// Route to get all attendance records
app.get('/attendance', (req, res) => {
    res.json(attendanceData);
});

// Route to update attendance record
app.put('/attendance/:date', (req, res) => {
    const dateToUpdate = req.params.date;
    const { studentName } = req.body;
    const recordIndex = attendanceData.findIndex(record => record.date === dateToUpdate);
    if (recordIndex === -1) {
        return res.status(404).json({ message: 'Attendance record not found' });
    }
    attendanceData[recordIndex].studentName = studentName;
    res.json({ message: 'Attendance record updated', attendance: attendanceData[recordIndex] });
});

// Route to delete attendance record
app.delete('/attendance/:date', (req, res) => {
    const dateToDelete = req.params.date;
    const recordIndex = attendanceData.findIndex(record => record.date === dateToDelete);
    if (recordIndex === -1) {
        return res.status(404).json({ message: 'Attendance record not found' });
    }
    attendanceData.splice(recordIndex, 1);
    res.json({ message: 'Attendance record deleted' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
