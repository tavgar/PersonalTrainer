document.addEventListener('DOMContentLoaded', function() {
  const addWorkoutForm = document.getElementById('addWorkoutForm');
  const editWorkoutForm = document.getElementById('editWorkoutForm');
  const workoutsTableBody = document.querySelector('table tbody');
  const addWorkoutModal = document.getElementById('addWorkoutModal');
  const editWorkoutModal = document.getElementById('editWorkoutModal');
  const addBtn = document.getElementById('addBtn');

  // Fetch all workouts
  async function fetchWorkouts() {
    try {
      const response = await fetch('http://localhost:3000/api/workouts');
      const result = await response.json();
      renderWorkouts(result.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  }

  // Render workouts to the table
  function renderWorkouts(workouts) {
    workoutsTableBody.innerHTML = '';
    workouts.forEach(workout => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${workout.date}</td>
        <td>${workout.type}</td>
        <td>${workout.duration}</td>
        <td>${workout.calories}</td>
        <td>
          <button class="edit-btn" data-id="${workout.id}">Edit</button>
          <button class="delete-btn" data-id="${workout.id}">Delete</button>
        </td>
      `;
      workoutsTableBody.appendChild(row);
    });
    attachEventListeners();
  }

  // Add workout
  addWorkoutForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(addWorkoutForm);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch('http://localhost:3000/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      fetchWorkouts();
      addWorkoutModal.style.display = 'none';
      addWorkoutForm.reset();
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  });

  // Delete workout
  async function deleteWorkout(id) {
    try {
      await fetch(`http://localhost:3000/api/workouts/${id}`, {
        method: 'DELETE'
      });
      fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  }

  // Edit workout
  async function editWorkout(id, data) {
    try {
      await fetch(`http://localhost:3000/api/workouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      fetchWorkouts();
    } catch (error) {
      console.error('Error editing workout:', error);
    }
  }

  // Attach event listeners to edit and delete buttons
  function attachEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        deleteWorkout(id);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const row = button.closest('tr');
        const date = row.children[0].innerText;
        const type = row.children[1].innerText;
        const duration = row.children[2].innerText;
        const calories = row.children[3].innerText;
        openEditModal(id, date, type, duration, calories);
      });
    });
  }

  // Open edit modal with pre-filled data
  function openEditModal(id, date, type, duration, calories) {
    editWorkoutForm.querySelector('#editWorkoutId').value = id;
    editWorkoutForm.querySelector('#editWorkoutDate').value = date;
    editWorkoutForm.querySelector('#editWorkoutType').value = type;
    editWorkoutForm.querySelector('#editWorkoutDuration').value = duration;
    editWorkoutForm.querySelector('#editWorkoutCalories').value = calories;

    editWorkoutModal.style.display = 'block';
  }

  // Handle edit form submission
  editWorkoutForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(editWorkoutForm);
    const data = Object.fromEntries(formData.entries());
    const workoutId = data.id; // Retrieve the ID from the hidden input field
    delete data.id;  // Remove id from data before sending to the server

    await editWorkout(workoutId, data);
    editWorkoutModal.style.display = 'none';
  });

  // Handle modal close buttons
  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', function() {
      this.closest('.modal').style.display = 'none';
    });
  });

  // Open Add Workout Modal
  addBtn.addEventListener('click', function() {
    addWorkoutModal.style.display = 'block';
  });

  // Fetch workouts on page load
  fetchWorkouts();
});
