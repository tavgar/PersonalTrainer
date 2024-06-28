document.addEventListener('DOMContentLoaded', function() {
  const addNutritionForm = document.getElementById('addNutritionForm');
  const editNutritionForm = document.getElementById('editNutritionForm');
  const nutritionTableBody = document.querySelector('table tbody');
  const addNutritionModal = document.getElementById('addNutritionModal');
  const editNutritionModal = document.getElementById('editNutritionModal');
  const addBtn = document.getElementById('addBtn');

  // Fetch all nutrition entries
  async function fetchNutrition() {
    try {
      const response = await fetch('http://localhost:3000/api/nutrition');
      const result = await response.json();
      renderNutrition(result.data);
    } catch (error) {
      console.error('Error fetching nutrition:', error);
    }
  }

  // Render nutrition entries to the table
  function renderNutrition(nutritionEntries) {
    nutritionTableBody.innerHTML = '';
    nutritionEntries.forEach(nutrition => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${nutrition.date}</td>
        <td>${nutrition.meal}</td>
        <td>${nutrition.food}</td>
        <td>${nutrition.calories}</td>
        <td>
          <button class="edit-btn" data-id="${nutrition.id}">Edit</button>
          <button class="delete-btn" data-id="${nutrition.id}">Delete</button>
        </td>
      `;
      nutritionTableBody.appendChild(row);
    });
    attachEventListeners();
  }

  // Add nutrition entry
  addNutritionForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(addNutritionForm);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch('http://localhost:3000/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      fetchNutrition();
      addNutritionModal.style.display = 'none';
      addNutritionForm.reset();
    } catch (error) {
      console.error('Error adding nutrition entry:', error);
    }
  });

  // Delete nutrition entry
  async function deleteNutrition(id) {
    try {
      await fetch(`http://localhost:3000/api/nutrition/${id}`, {
        method: 'DELETE'
      });
      fetchNutrition();
    } catch (error) {
      console.error('Error deleting nutrition entry:', error);
    }
  }

  // Edit nutrition entry
  async function editNutrition(id, data) {
    try {
      await fetch(`http://localhost:3000/api/nutrition/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      fetchNutrition();
    } catch (error) {
      console.error('Error editing nutrition entry:', error);
    }
  }

  // Attach event listeners to edit and delete buttons
  function attachEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        deleteNutrition(id);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const row = button.closest('tr');
        const date = row.children[0].innerText;
        const meal = row.children[1].innerText;
        const food = row.children[2].innerText;
        const calories = row.children[3].innerText;
        openEditModal(id, date, meal, food, calories);
      });
    });
  }

  // Open edit modal with pre-filled data
  function openEditModal(id, date, meal, food, calories) {
    editNutritionForm.querySelector('#editNutritionId').value = id;
    editNutritionForm.querySelector('#editNutritionDate').value = date;
    editNutritionForm.querySelector('#editNutritionMeal').value = meal;
    editNutritionForm.querySelector('#editNutritionFood').value = food;
    editNutritionForm.querySelector('#editNutritionCalories').value = calories;

    editNutritionModal.style.display = 'block';
  }

  // Handle edit form submission
  editNutritionForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(editNutritionForm);
    const data = Object.fromEntries(formData.entries());
    const nutritionId = data.id; // Retrieve the ID from the hidden input field
    delete data.id;  // Remove id from data before sending to the server

    await editNutrition(nutritionId, data);
    editNutritionModal.style.display = 'none';
  });

  // Handle modal close buttons
  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', function() {
      this.closest('.modal').style.display = 'none';
    });
  });

  // Open Add Nutrition Modal
  addBtn.addEventListener('click', function() {
    addNutritionModal.style.display = 'block';
  });

  // Fetch nutrition entries on page load
  fetchNutrition();
});
