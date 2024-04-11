document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('attendanceForm');
    const tableBody = document.querySelector('#attendanceTable tbody');
    const selectDateInput = document.getElementById('selectDate');
    const changeDateButton = document.getElementById('changeDate');
    let allAttendanceData = []; // Store all attendance data
  
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const studentNameInput = document.getElementById('studentName');
        const studentName = studentNameInput.value.trim();
        if (studentName !== '' && !isStudentNameExists(studentName)) {
            addAttendance(studentName);
            studentNameInput.value = '';
        } else {
            alert('Student name already exists or is empty!');
        }
    });

    function isStudentNameExists(studentName) {
        return allAttendanceData.some(entry => entry.studentName === studentName);
    }

    function addAttendance(studentName) {
        addAttendanceToTable(studentName);
        // Save attendance data to local storage
        allAttendanceData.push({ studentName });
        saveAttendanceToLocalStorage(allAttendanceData);
    }

    function saveAttendanceToLocalStorage(data) {
        localStorage.setItem('attendanceData', JSON.stringify(data));
    }

    function loadAttendanceFromLocalStorage() {
        allAttendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
        allAttendanceData.forEach(({ studentName }) => {
            addAttendanceToTable(studentName);
        });
    }

    function addAttendanceToTable(studentName) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${studentName}</td>
            <td><input type="checkbox"></td>
            <td>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    }

    loadAttendanceFromLocalStorage();

    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete')) {
            const row = event.target.closest('tr');
            const studentName = row.querySelector('td:first-child').textContent;
            deleteAttendanceFromLocalStorage(studentName);
            tableBody.removeChild(row);
        } else if (event.target.classList.contains('edit')) {
            const row = event.target.closest('tr');
            const studentName = row.querySelector('td:first-child').textContent;
            const newStudentName = prompt('Edit student name:', studentName);
            if (newStudentName !== null) {
                row.querySelector('td:first-child').textContent = newStudentName;
                updateAttendanceInLocalStorage(studentName, newStudentName);
            }
        }
    });

    function deleteAttendanceFromLocalStorage(studentName) {
        allAttendanceData = allAttendanceData.filter(entry => entry.studentName !== studentName);
        saveAttendanceToLocalStorage(allAttendanceData);
    }

    function updateAttendanceInLocalStorage(oldStudentName, newStudentName) {
        allAttendanceData.forEach(entry => {
            if (entry.studentName === oldStudentName) {
                entry.studentName = newStudentName;
            }
        });
        saveAttendanceToLocalStorage(allAttendanceData);
    }

    // Function to change the displayed attendance data based on selected date
    changeDateButton.addEventListener('click', function() {
        const selectedDate = selectDateInput.value;
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            row.style.display = ''; // Show all rows
        });
    });
});
