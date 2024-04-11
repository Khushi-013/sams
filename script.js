document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('attendanceForm');
    const tableBody = document.querySelector('#attendanceTable tbody');
    const selectDateInput = document.getElementById('selectDate');
    const changeDateButton = document.getElementById('changeDate');
    const saveAttendanceButton = document.getElementById('saveAttendance');
    let currentAttendanceDate = ''; // Store the current attendance date

    // Load attendance data from localStorage if available
    let allAttendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const studentNameInput = document.getElementById('studentName');
        const studentName = studentNameInput.value.trim();
        if (studentName !== '') {
            addAttendance(studentName);
            studentNameInput.value = '';
        }
    });

    saveAttendanceButton.addEventListener('click', function() {
        if (currentAttendanceDate !== '') {
            saveAttendanceData(currentAttendanceDate);
            alert('Attendance saved successfully!');
        } else {
            alert('Please select a date to save attendance.');
        }
    });

    function addAttendance(studentName) {
        console.log('Adding attendance for:', studentName);
        // Check if the currentAttendanceDate is not empty
        if (!currentAttendanceDate) {
            alert('Please select a date before adding attendance.');
            return;
        }
    
        // Initialize attendance data for the current date if not already present
        if (!allAttendanceData[currentAttendanceDate]) {
            allAttendanceData[currentAttendanceDate] = {};
        }
    
        // Check if the student name already exists for the current date
        if (allAttendanceData[currentAttendanceDate][studentName]) {
            alert('Student name already exists for the selected date.');
            return;
        }
    
        // Add the attendance entry
        allAttendanceData[currentAttendanceDate][studentName] = false;

        // Update the table
        updateTable(currentAttendanceDate);
    }

    function updateTable(date) {
        tableBody.innerHTML = ''; // Clear existing rows
        if (allAttendanceData[date]) {
            Object.entries(allAttendanceData[date]).forEach(([studentName, isPresent]) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${studentName}</td>
                    <td><input type="checkbox" ${isPresent ? 'checked' : ''}></td>
                    <td>
                        <button class="edit" data-date="${date}" data-student="${studentName}">Edit</button>
                        <button class="delete" data-date="${date}" data-student="${studentName}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    }
    
    function saveAttendanceData(date) {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const studentName = row.querySelector('td:first-child').textContent;
            const isPresent = row.querySelector('input[type="checkbox"]').checked;
            allAttendanceData[date][studentName] = isPresent;
        });
        localStorage.setItem('attendanceData', JSON.stringify(allAttendanceData));
        console.log('Attendance saved:', allAttendanceData);
    }

    changeDateButton.addEventListener('click', function() {
        const selectedDate = selectDateInput.value;
        if (selectedDate !== currentAttendanceDate) {
            if (currentAttendanceDate !== '') {
                if (confirm('Do you want to save the current attendance?')) {
                    saveAttendanceData(currentAttendanceDate);
                    alert('Attendance saved successfully!');
                }
            }
            currentAttendanceDate = selectedDate;
            // Load attendance data for the selected date
            updateTable(currentAttendanceDate);
        }
    });

    // Handle edit and delete buttons
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit')) {
            const date = event.target.getAttribute('data-date');
            const studentName = event.target.getAttribute('data-student');
            const newStudentName = prompt('Edit student name:', studentName);
            if (newStudentName !== null && newStudentName.trim() !== '') {
                delete allAttendanceData[date][studentName];
                allAttendanceData[date][newStudentName] = false;
                localStorage.setItem('attendanceData', JSON.stringify(allAttendanceData));
                updateTable(date);
            }
        } else if (event.target.classList.contains('delete')) {
            const date = event.target.getAttribute('data-date');
            const studentName = event.target.getAttribute('data-student');
            if (confirm(`Are you sure you want to delete ${studentName}?`)) {
                delete allAttendanceData[date][studentName];
                localStorage.setItem('attendanceData', JSON.stringify(allAttendanceData));
                updateTable(date);
            }
        }
    });

    // Load initial attendance data if available
    if (currentAttendanceDate) {
        updateTable(currentAttendanceDate);
    }
});
