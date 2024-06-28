const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const workoutRoutes = require('./routes/workoutRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const recordsRoutes = require('./routes/recordsRoutes');
const goalsRoutes = require('./routes/goalsRoutes');
const indexRoutes = require('./routes/indexRoutes');
const chartRoutes = require('./routes/chartRoutes'); // Add this line

app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api', indexRoutes);
app.use('/api/charts', chartRoutes); // Add this line

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
