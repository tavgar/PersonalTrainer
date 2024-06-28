document.addEventListener('DOMContentLoaded', function() {
  const addGoalForm = document.getElementById('addGoalForm');
  const editGoalForm = document.getElementById('editGoalForm');
  const goalsContainer = document.getElementById('goalsContainer');
  const addGoalModal = document.getElementById('addGoalModal');
  const editGoalModal = document.getElementById('editGoalModal');
  const addBtn = document.getElementById('addBtn');

  // Function to handle modals
  function handleModal(modalId, openButtonId, closeButtonClass) {
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(openButtonId);
    const span = modal.getElementsByClassName(closeButtonClass)[0];

    if (btn) {
      btn.onclick = function() {
        modal.style.display = 'block';
      }
    }

    if (span) {
      span.onclick = function() {
        modal.style.display = 'none';
      }
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    }
  }

  // Handle Goal Modals
  handleModal('addGoalModal', 'addBtn', 'close');
  handleModal('editGoalModal', null, 'close'); // The edit button will be handled separately

  // Function to update goal specific fields based on goal type
  function updateGoalSpecificFields(formId, goalType) {
    const container = document.getElementById(formId).querySelector('.goalSpecificFields');
    container.innerHTML = ''; // Clear existing fields
    if (goalType === 'nutrition') {
      container.innerHTML = `
        <label for="goalCalories">Calories Target:</label>
        <input type="number" id="goalCalories" name="target" required>
      `;
    } else if (goalType === 'weight') {
      container.innerHTML = `
        <label for="goalWeight">Weight Target:</label>
        <input type="number" id="goalWeight" class="weight-target" name="weight" required>
        <label for="goalFat">Fat Percentage Target:</label>
        <input type="number" id="goalFat" class="weight-target" name="fat" required>
        <label for="goalMuscle">Muscle Percentage Target:</label>
        <input type="number" id="goalMuscle" class="weight-target" name="muscle" required>
      `;
    } else if (goalType === 'workout') {
      container.innerHTML = `
        <label for="goalCaloriesBurn">Calories Burn Target:</label>
        <input type="number" id="goalCaloriesBurn" name="target" required>
      `;
    }
  }

  // Function to fetch all goals
  async function fetchGoals() {
    try {
      const response = await fetch('http://localhost:3000/api/goals');
      const result = await response.json();
      renderGoals(result.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  }

  // Render goals to the container
  function renderGoals(goals) {
    goalsContainer.innerHTML = '';
    goals.forEach(goal => {
      const goalType = goal.type;
      const description = goal.description;
      const title = goal.title;
      const date = new Date(goal.date).toLocaleDateString(); // Display date in a readable format
      let target = '';
      let targetTypeText = '';
      if (goalType === 'nutrition') {
        target = `Calories: ${goal.target}`;
        targetTypeText = 'Nutrition Goal';
      } else if (goalType === 'weight') {
        const [weight, fat, muscle] = goal.target.split('-');
        target = `Weight: ${weight}kg, Fat: ${fat}%, Muscle: ${muscle}%`;
        targetTypeText = 'Weight Goal';
      } else if (goalType === 'workout') {
        target = `Calories Burn: ${goal.target}`;
        targetTypeText = 'Workout Goal';
      }
      const goalCard = document.createElement('div');
      goalCard.className = `goal-card ${goalType}-goal`;
      goalCard.dataset.id = goal.id;
      goalCard.dataset.progress = goal.progress;

      goalCard.innerHTML = `
        <div class="goal-header">
          <h3>${title}</h3>
          <small>${targetTypeText}</small>
          <div class="goal-actions">
            <button class="edit-btn" data-id="${goal.id}">Edit</button>
            <button class="delete-btn" data-id="${goal.id}">Delete</button>
          </div>
        </div>
        <p class="goal-description">${description}</p>
        <p class="goal-target">${target}</p>
        <p class="goal-date">Start Date: ${date}</p>
        <div class="goal-progress">
          <div class="progress-bar" style="width: ${goal.progress}%;"></div>
          <span class="progress-percentage">${goal.progress}%</span>
        </div>
      `;
      goalsContainer.appendChild(goalCard);
    });
    attachEventListeners();
  }

  // Add goal
  addGoalForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(addGoalForm);
    let data = Object.fromEntries(formData.entries());
    const goalType = data.type;
    if (goalType === 'weight') {
      const weight = document.getElementById('goalWeight').value;
      const fat = document.getElementById('goalFat').value;
      const muscle = document.getElementById('goalMuscle').value;
      data.target = `${weight}-${fat}-${muscle}`;
    }
    data.date = new Date(data.date).toISOString(); // Convert date to ISO 8601 format

    try {
      await fetch('http://localhost:3000/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      fetchGoals();
      addGoalModal.style.display = 'none';
      addGoalForm.reset();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  });

  // Delete goal
  async function deleteGoal(id) {
    try {
      await fetch(`http://localhost:3000/api/goals/${id}`, {
        method: 'DELETE'
      });
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  }

  // Edit goal
  async function editGoal(id, data) {
    try {
      await fetch(`http://localhost:3000/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      fetchGoals();
    } catch (error) {
      console.error('Error editing goal:', error);
    }
  }

  // Attach event listeners to edit and delete buttons
  function attachEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        deleteGoal(id);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const goalCard = button.closest('.goal-card');
        const title = goalCard.querySelector('h3').innerText;
        const description = goalCard.querySelector('.goal-description').innerText;
        const date = new Date(goalCard.querySelector('.goal-date').innerText.split(': ')[1]).toISOString(); // Convert date to ISO 8601 format
        const type = goalCard.classList.contains('nutrition-goal') ? 'nutrition' : goalCard.classList.contains('weight-goal') ? 'weight' : 'workout';
        openEditModal(id, type, title, description, date, goalCard);
      });
    });
  }

  // Open edit modal with pre-filled data
  function openEditModal(id, type, title, description, date, goalCard) {
    editGoalForm.querySelector('#editGoalId').value = id;
    editGoalForm.querySelector('#editGoalType').value = type;
    editGoalForm.querySelector('#editGoalTitle').value = title;
    editGoalForm.querySelector('#editGoalDescription').value = description;
    editGoalForm.querySelector('#editGoalDate').value = new Date(date).toLocaleDateString(); // Display date in a readable format

    updateGoalSpecificFields('editGoalForm', type);

    if (type === 'nutrition') {
      const caloriesField = document.getElementById('goalCalories');
      caloriesField.value = goalCard.querySelector('.goal-target').innerText.split(' ')[1];
    } else if (type === 'weight') {
      const weightField = document.getElementById('goalWeight');
      const fatField = document.getElementById('goalFat');
      const muscleField = document.getElementById('goalMuscle');
      const targetParts = goalCard.querySelector('.goal-target').innerText.split(' ')[1].split('-');
      weightField.value = targetParts[0];
      fatField.value = targetParts[1];
      muscleField.value = targetParts[2];
    } else if (type === 'workout') {
      const caloriesBurnField = document.getElementById('goalCaloriesBurn');
      caloriesBurnField.value = goalCard.querySelector('.goal-target').innerText.split(' ')[2];
    }

    editGoalModal.style.display = 'block';
  }

  // Handle edit form submission
  editGoalForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(editGoalForm);
    let data = Object.fromEntries(formData.entries());
    const goalId = data.id; // Retrieve the ID from the hidden input field
    delete data.id;  // Remove id from data before sending to the server
    const goalType = data.type;
    if (goalType === 'weight') {
      const weight = document.getElementById('goalWeight').value;
      const fat = document.getElementById('goalFat').value;
      const muscle = document.getElementById('goalMuscle').value;
      data.target = `${weight}-${fat}-${muscle}`;
    }
    data.date = new Date(data.date).toISOString(); // Convert date to ISO 8601 format

    await editGoal(goalId, data);
    editGoalModal.style.display = 'none';
  });

  // Handle modal close buttons
  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', function() {
      this.closest('.modal').style.display = 'none';
    });
  });

  // Open Add Goal Modal
  addBtn.addEventListener('click', function() {
    addGoalModal.style.display = 'block';
  });

  // Initial update of goal specific fields
  document.getElementById('goalType').addEventListener('change', function() {
    updateGoalSpecificFields('addGoalForm', this.value);
  });

  document.getElementById('editGoalType').addEventListener('change', function() {
    updateGoalSpecificFields('editGoalForm', this.value);
  });

  // Fetch goals on page load
  fetchGoals();
});
