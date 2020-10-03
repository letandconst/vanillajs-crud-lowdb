// db setup
let adapter = new LocalStorage("students");
let db = low(adapter);
db.defaults({
    students: []
}).write();


const students = db.get("students").value();

// students adding form
const form = document.querySelector("#students-form");


// add student 

const addStudent = (students) => {
    db.get("students").push(students).write();
    alert("Student has been successfully added!")
};

// delete student 
const removeStudent = () => {
    return students.splice(
        students.findIndex(({
            ids
        }) => {
            return ids == ids;
        }),
        1
    );
};


// find student if existing

const studentIfExisting = (studentID) => {

    return students.find((student) => student.studentID == studentID);

};

// students table
const studentsTable = document.querySelector("#students-table > tbody");




const displayStudents = (students) => {
    let rows = students.map((student) => {
        const row = `<tr style="text-align:center;" data-ids="${student.studentID}">
        <td>${student.studentID}</td>
        <td>${student.studentName}</td>
        <td>${student.studentAge}</td>
        <td>${student.studentAddress}</td>
        <td>${student.studentCourse}</td>
        <td>
          <button
            class="btn btn-warning edit"
            type="button" data-toggle="modal" data-target="#editModal"
            style="margin-bottom: 0; margin-left: 0; font-size:12px;"
          >
          <i class="fa fa-pencil"></i>
         </button>
         
          <button
            class="btn btn-danger delete"
            type="button"
            style="margin-bottom: 0; margin-left: 5px; font-size:12px;"
          >
          <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>`;
    
        return row;
    });
    studentsTable.innerHTML = rows.join("");
    
};



form.addEventListener("submit", function(e) {
    e.preventDefault();
});

form.addEventListener("click", function(e) {

    let ids = document.querySelector("input[name='studentID']").value.trim();
    let fullName = document.querySelector("input[name='studentName']").value.trim();
    let age = document.querySelector("input[name='studentAge']").value.trim();
    let address = document.querySelector("input[name='studentAddress']").value.trim();
    let course = document.querySelector("select[name='studentCourse']").value.trim();

    if (e.target.classList.contains("add")) {
        let student = {
            studentID: ids,
            studentName: fullName,
            studentAge: age,
            studentAddress: address,
            studentCourse: course,
        };

        if (ids && fullName && age && address && course) {
            addStudent(student);

            form.reset();
            displayStudents(students);
        } else {
            alert("all field must not be empty");
        }
    }


});

displayStudents(students);

studentsTable.addEventListener("click", function(e) {
    let studentRow = e.target.parentNode.parentNode;

    if (e.target.className.includes("delete")) {

        let isDelete = false;

        // show prompt
        const r = confirm("Are you sure ?");

        // set delete confirmation flag
        if (r == true) {
            isDelete = true;
        } else {
            isDelete = false;
        }

        // if cancelled, don't continue deletion
        if (!isDelete) return 0;

        db.get("students")
            .remove({
                studentID: e.target.parentNode.parentNode.dataset.ids
            })
            .write();
        alert("Student  was successfully deleted")
        studentRow.remove();
    }

 

    if (e.target.className.includes("edit")) {


        let arrData = Array.from(studentsTable.children);
        document.querySelector("input[name='studentID']").value =
            arrData[0].innerText;
        document.querySelector("input[name='studentName']").value = arrData[1].innerText;
        document.querySelector("input[name='studentAge']").value = arrData[2].innerText;
        document.querySelector("input[name='studentAddress']").value =
            arrData[3].innerText;
        document.querySelector("select[name='studentCourse']").value =
            arrData[4].innerText;

    }
});

if (students.length == 0) {
  // create a template form a table row
  const row = `<tr>
  <td style="text-align: center;" colspan="6">No Data Available</td>
</tr>`;

  // concatenate new row to the table
  studentsTable.innerHTML += row;
}


//search

const search = () => {

    let filter = document.getElementById('search-input').value.toUpperCase();
    let table = document.getElementById('students-table');
    let tblRow = table.getElementsByTagName('tr');

    for (let i = 0; i < tblRow.length; i++) {
        let tblCol = tblRow[i].getElementsByTagName('td')[1];

        if (tblCol) {
            let textvalue = tblCol.textContent || tblCol.innerHTML;

            if (textvalue.toUpperCase().indexOf(filter) > -1) {
                tblRow[i].style.display = "";
                
            } else {
                tblRow[i].style.display = "none";
                
                
              
                // concatenate new row to the table
                studentsTable.innerHTML += row;
            }

        }

    }
}


//Pagination JS
