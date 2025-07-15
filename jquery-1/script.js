const studentData = [
  { name: "Ece", gender: "Female", age: 20 },
  { name: "Tahsin", gender: "Male", age: 20 },
  { name: "Fuat", gender: "Male", age: 20 },
  { name: "Sude", gender: "Female", age: 20 },
  { name: "Aysima", gender: "Female", age: 20 },
];

function renderTable() {
  const rows = studentData
    .map(
      (student, index) => `
      <tr data-index="${index}">
        <td>${student.name}</td>
        <td>${student.gender}</td>
        <td>${student.age}</td>
        <td><button class="delete-btn">Delete</button></td>
      </tr>
    `
    )
    .join("");

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Gender</th>
          <th>Age</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  $(".table").html(tableHTML);

  $("tbody tr").click(function () {
    $(this).toggleClass("highlight");
  });

  $(".delete-btn").click(function (e) {
    e.stopPropagation();
    const row = $(this).closest("tr");
    const index = row.data("index");
    studentData.splice(index, 1);
    renderTable();
  });
}

$(document).ready(function () {
  renderTable();

  $("#student-form").submit(function (e) {
    e.preventDefault();

    const name = $("input[name='name']").val();
    const gender = $("input[name='gender']:checked").val();
    const age = $("input[name='age']").val();

    const newStudent = { name, gender, age };

    studentData.push(newStudent);
    renderTable();

    this.reset();
  });
});
