document.addEventListener('DOMContentLoaded', function() {
  // Function to handle modal
  function handleModal(modalId, openButtonId, closeButtonClass) {
    var modal = document.getElementById(modalId);
    var btn = document.getElementById(openButtonId);
    var span = modal.getElementsByClassName(closeButtonClass)[0];

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

  // Handle Add Record Modal
  handleModal('addRecordModalWelcome', 'addBtn', 'close');

  // Handle Add Record Form Submission
  document.getElementById('addRecordFormWelcome').addEventListener('submit', async function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    var data = {};
    formData.forEach((value, key) => data[key] = value);
    console.log('Add Record from Welcome:', data);

    try {
      const response = await fetch('http://localhost:3000/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Record added successfully');
        this.closest('.modal').style.display = 'none';
        this.reset();
        // Optionally, refresh data or update UI
        fetchOverview(); // Refresh overview data after adding a record
      } else {
        console.error('Error adding record');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // Fetch overview data
  async function fetchOverview() {
    try {
      const response = await fetch('http://localhost:3000/api/overview');
      const result = await response.json();
      displayOverview(result);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    }
  }

  // Fetch overview data
  async function fetchOverview() {
    try {
      const response = await fetch('http://localhost:3000/api/overview');
      const result = await response.json();
      displayOverview(result);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    }
  }

// Display overview data
  function displayOverview(data) {
    // Display user name
    document.querySelector('.welcome-section h2').textContent = `Welcome, ${data.userName}!`;

    // Display recent activity
    document.getElementById('lastWorkout').textContent = `Last workout: ${data.recentActivity.latestWorkout.type}`;
    document.getElementById('lastMeal').textContent = `Last meal: ${data.recentActivity.latestMeal.food}`;

    // Display goals progress
    const goalsProgressContainer = document.getElementById('goalsProgress');
    goalsProgressContainer.innerHTML = '';
    data.goalsProgress.forEach(goal => {
      const listItem = document.createElement('li');
      listItem.textContent = `${goal.title}: ${goal.progress}%`;
      goalsProgressContainer.appendChild(listItem);
    });

    // Display progress overview
    document.getElementById('weightOverview').textContent = `Weight: ${data.latestRecord.weight} kg`;
    document.getElementById('bodyFatOverview').textContent = `Body Fat: ${data.latestRecord.fat} %`;
  }

// Fetch and display overview data on page load
  fetchOverview();

});
