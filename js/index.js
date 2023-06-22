import '@popperjs/core';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js';

document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('#students-form');
	const container = document.querySelector('#addStudentModal');
	const modal = new Modal(container);

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		const ids = document.querySelector("input[name='studentID']").value.trim();
		const fullName = document.querySelector("input[name='studentName']");
		const age = document.querySelector("input[name='studentAge']");
		const address = document.querySelector("input[name='studentAddress']");
		const course = document.querySelector("select[name='studentCourse']");

		const fullNameValue = fullName.value.trim();
		const ageValue = age.value.trim();
		const addressValue = address.value.trim();
		const courseValue = course.value.trim();

		if (ids && fullName && age && address && course) {
			const student = {
				studentID: ids,
				studentName: fullNameValue,
				studentAge: ageValue,
				studentAddress: addressValue,
				studentCourse: courseValue,
			};
			form.reset();
			modal.hide();
			document.body.classList.remove('modal-open'); // Remove the 'modal-open' class from the body
			document.querySelector('.modal-backdrop').remove(); // Remove the modal backdrop element
		} else {
			alert('all field must not be empty');
		}
	});
});
