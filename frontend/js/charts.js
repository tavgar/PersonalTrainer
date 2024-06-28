document.addEventListener('DOMContentLoaded', function() {
  // Fetch and render body weight distribution data
  async function fetchBodyWeightDistributionData() {
    try {
      const response = await fetch('http://localhost:3000/api/charts/body-weight-distribution');
      const result = await response.json();
      console.log('Body weight distribution data:', result.data);
      const data = [result.data.fat, result.data.muscles];
      renderBodyWeightDistributionChart(data);
    } catch (error) {
      console.error('Error fetching body weight distribution data:', error);
    }
  }

  // Render body weight distribution chart
  function renderBodyWeightDistributionChart(data) {
    const canvas = document.getElementById('bodyWeightChart');
    const ctx = canvas.getContext('2d');
    const colors = ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'];
    const borderColors = ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'];
    const labels = ['Fat', 'Muscles'];
    const total = data.reduce((acc, val) => acc + val, 0);
    let startAngle = 0;

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index];
      ctx.fill();
      ctx.strokeStyle = borderColors[index];
      ctx.stroke();

      // Draw label
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = canvas.width / 2 + (canvas.height / 2.5) * Math.cos(midAngle);
      const labelY = canvas.height / 2 + (canvas.height / 2.5) * Math.sin(midAngle);
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.fillText(labels[index], labelX - 10, labelY);

      startAngle = endAngle;
    });
  }

  // Fetch and render data on page load
  fetchBodyWeightDistributionData();
});
