document.addEventListener('DOMContentLoaded', function() {
  const addRecordBtn = document.getElementById('addRecordBtn');
  const addRecordModal = document.getElementById('addRecordModal');
  const editRecordModal = document.getElementById('editRecordModal');
  const addRecordForm = document.getElementById('addRecordForm');
  const editRecordForm = document.getElementById('editRecordForm');
  const recordsTableBody = document.querySelector('table tbody');

  // Function to handle modals
  function handleModal(modal, openButton, closeButtonClass) {
    const span = modal.getElementsByClassName(closeButtonClass)[0];

    openButton.onclick = function() {
      modal.style.display = 'block';
    }

    span.onclick = function() {
      modal.style.display = 'none';
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    }
  }

  // Handle Add Record Modal
  handleModal(addRecordModal, addRecordBtn, 'close');

  // Fetch all records
  async function fetchRecords() {
    try {
      const response = await fetch('http://localhost:3000/api/records');
      const result = await response.json();
      renderRecords(result.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  }

  // Render records to the table
  function renderRecords(records) {
    recordsTableBody.innerHTML = '';
    records.forEach(record => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.date}</td>
        <td>${record.weight}</td>
        <td>${record.fat}</td>
        <td>${record.muscles}</td>
        <td>
          <button class="edit-btn" data-id="${record.id}">Edit</button>
          <button class="delete-btn" data-id="${record.id}">Delete</button>
        </td>
      `;
      recordsTableBody.appendChild(row);
    });
    attachEventListeners();
  }

  // Add record
  addRecordForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(addRecordForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:3000/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      fetchRecords();
      addRecordForm.reset();
      addRecordModal.style.display = 'none'; // Close the modal
    } catch (error) {
      console.error('Error adding record:', error);
    }
  });

  // Delete record
  async function deleteRecord(id) {
    try {
      await fetch(`http://localhost:3000/api/records/${id}`, {
        method: 'DELETE'
      });
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  }

  // Attach event listeners to edit and delete buttons
  function attachEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        deleteRecord(id);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const recordRow = button.closest('tr');
        openEditModal(id, recordRow);
      });
    });
  }

  // Open edit modal with pre-filled data
  function openEditModal(id, recordRow) {
    const dateField = document.getElementById('editRecordDate');
    const weightField = document.getElementById('editRecordWeight');
    const fatField = document.getElementById('editRecordFat');
    const musclesField = document.getElementById('editRecordMuscles');

    dateField.value = recordRow.children[0].innerText;
    weightField.value = recordRow.children[1].innerText;
    fatField.value = recordRow.children[2].innerText;
    musclesField.value = recordRow.children[3].innerText;

    editRecordForm.setAttribute('data-id', id);
    editRecordModal.style.display = 'block';
  }

  // Handle edit form submission
  editRecordForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const id = editRecordForm.getAttribute('data-id');
    const formData = new FormData(editRecordForm);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch(`http://localhost:3000/api/records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      fetchRecords();
      editRecordModal.style.display = 'none';
    } catch (error) {
      console.error('Error editing record:', error);
    }
  });

  // Fetch records on page load
  fetchRecords();
});
