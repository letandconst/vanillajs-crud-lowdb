// LowDB initialization
const adapter = new LocalStorage('students');
const db = low(adapter);

db.defaults({
	students: [],
}).write();

const students = db.get('students').value();

document.addEventListener('DOMContentLoaded', () => {
	// Variables
	const studentsTable = document.querySelector('#students-table > tbody');
	const form = document.querySelector('#students-form');
	const updateStudentForm = document.querySelector('#update-students-form');
	const searchInput = document.querySelector('#search-input');
	const addContainer = document.querySelector('#addStudentModal');
	const editContainer = document.querySelector('#editStudentModal');
	const modal = new bootstrap.Modal(addContainer);
	const editModal = new bootstrap.Modal(editContainer);

	// Form Inputs
	const fullName = document.querySelector("input[name='studentName']");
	const address = document.querySelector("input[name='studentAddress']");
	const course = document.querySelector("select[name='studentCourse']");

	// Edit Form Inputs
	const currentFullName = document.querySelector("input[name='currentFullName']");
	const currentAddress = document.querySelector("input[name='currentAddress']");
	const currentBirthdate = document.querySelector("input[name='currentBirthdate']");
	const currentCourse = document.querySelector("select[name='currentCourse']");
	const maleRadio = document.querySelector('#studentMale');
	const femaleRadio = document.querySelector('#studentFemale');

	let selectedStudentID;

	// Function for adding a student data
	const addStudent = (students) => {
		db.get('students').push(students).write();
		alert('Student has been successfully added!');
	};

	const getStudentRecord = (student) => {
		selectedStudentID = student.studentID;
		currentFullName.value = student.studentName;
		currentAddress.value = student.studentAddress;
		currentBirthdate.value = student.studentBirthDate;
		currentCourse.value = student.studentCourse;

		if (student.studentGender === 'Male') {
			maleRadio.checked = true;
		} else if (student.studentGender === 'Female') {
			femaleRadio.checked = true;
		}
	};

	// Add event listener to the table and listen for click events
	studentsTable.addEventListener('click', function (e) {
		const studentRow = e.target.closest('tr');
		if (e.target.classList.contains('edit')) {
			const record = db.get('students').find({ studentID: studentRow.dataset.ids }).value();
			getStudentRecord(record);
		}
	});

	// Function for deleting a student data
	studentsTable.addEventListener('click', function (e) {
		const studentRow = e.target.closest('tr');

		if (e.target.classList.contains('delete')) {
			const shouldDelete = confirm('Are you sure?');

			if (!shouldDelete) return;

			db.get('students').remove({ studentID: studentRow.dataset.ids }).write();

			alert('Student was successfully deleted');
			studentRow.remove();
		}
	});

	// Function to filter the data based on the search query
	const filterData = (query) => {
		const filteredStudents = students.filter((student) => student.studentName.toLowerCase().includes(query.toLowerCase()));
		displayStudents(filteredStudents);
	};

	// Event listener for the search input field
	searchInput.addEventListener('input', function (e) {
		const searchQuery = e.target.value.trim();
		filterData(searchQuery);
	});

	// Function for displaying the students data
	const displayStudents = (students) => {
		// Clear the table body
		studentsTable.innerHTML = '';

		// Shows No Data Found if search query doesnt match
		if (students.length === 0) {
			const noDataRow = document.createElement('tr');
			const noDataCell = document.createElement('td');
			noDataCell.setAttribute('colspan', '7');
			noDataCell.textContent = 'No data found';
			noDataRow.appendChild(noDataCell);
			studentsTable.appendChild(noDataRow);
		} else {
			const rows = students.map((student, index) => {
				const row = `<tr style="text-align:center;" data-ids="${student.studentID}">
								<td>${student.studentID}</td>
								<td>${student.studentName}</td>
								<td>${student.studentBirthDate}</td>
								<td>${student.studentGender}</td>
								<td>${student.studentAddress}</td>
								<td>${student.studentCourse}</td>
								<td>
								<button
									class="btn btn-warning "
									type="button" data-toggle="modal" data-bs-toggle="modal"
									data-bs-target="#editStudentModal"
									data-id="${index}"		
								>
								<i class="bi bi-pencil-fill edit"></i>
								</button>
								
								<button
									class="btn btn-danger"
									type="button"
								>
								<i class="bi bi-trash-fill  delete"></i>
								</button>
								</td>
      						</tr>`;
				return row;
			});
			studentsTable.innerHTML = rows.join('');
		}
	};

	displayStudents(students);

	// Function for form datepicker
	const datepickerElem = document.querySelector('.birthdate');
	const datepicker = new Datepicker(datepickerElem, {
		format: 'dd/mm/yyyy',
	});

	let selectedDate = null;

	datepickerElem.addEventListener('changeDate', function (event) {
		selectedDate = event.detail.date;
		datepicker.hide();
	});

	// Clear current inputs when modal closed

	addContainer.addEventListener('hide.bs.modal', function (even0t) {
		// Clear the datepicker
		datepicker.setDate({
			clear: true,
		});

		// Clear other input fields
		fullName.value = '';
		address.value = '';
		course.value = '';
	});

	// Function for adding student data

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		const gender = document.querySelector("input[name='studentGender']:checked");

		const fullNameValue = fullName.value.trim();
		const genderValue = gender.checked === true ? gender.value : '';
		const addressValue = address.value.trim();
		const courseValue = course.value.trim();

		const studentID = generateRandomID(6);
		const formattedDate = selectedDate.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});

		if (fullNameValue && genderValue && addressValue && courseValue) {
			const student = {
				studentID: `23 - ${studentID}`,
				studentName: fullNameValue,
				studentBirthDate: formattedDate,
				studentGender: genderValue,
				studentAddress: addressValue,
				studentCourse: courseValue,
			};

			addStudent(student);
			form.reset();
			modal.hide();
			document.body.classList.remove('modal-open'); // Remove the 'modal-open' class from the body
			document.querySelector('.modal-backdrop').remove(); // Remove the modal backdrop element
			displayStudents(students);
		} else {
			alert('all field must not be empty');
		}
	});

	// Function for updating student data
	updateStudentForm.addEventListener('submit', function (e) {
		e.preventDefault();

		const updatedAddress = currentAddress.value;
		const updatedCourse = currentCourse.value;

		const studentRecord = db.get('students').find({ studentID: selectedStudentID }).value();
		studentRecord.studentAddress = updatedAddress;
		studentRecord.studentCourse = updatedCourse;

		db.get('students').find({ studentID: selectedStudentID }).assign(studentRecord).write();

		editModal.hide();
		document.body.classList.remove('modal-open'); // Remove the 'modal-open' class from the body
		document.querySelector('.modal-backdrop').remove(); // Remove the modal backdrop element
		displayStudents(students);
	});

	// Function for generating random student ID
	const generateRandomID = (length) => {
		const characters = '0123456789';
		let randomID = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			randomID += characters.charAt(randomIndex);
		}

		return randomID;
	};
});
