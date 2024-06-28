const express = require('express');
const router = express.Router();
const recordHelper = require('../helpers/recordHelper');
const goalHelper = require('../helpers/goalHelper');
const workoutHelper = require('../helpers/workoutHelper');
const nutritionHelper = require('../helpers/nutritionHelper');
const userHelper = require('../helpers/userHelper'); // Assuming you have a userHelper to fetch user data

// Get overview data
router.get('/overview', async (req, res) => {
    const userId = 1; // Assuming a single user for now

    try {
        console.log('Fetching latest record');
        const latestRecord = await recordHelper.getLatestRecord(userId);
        console.log('Latest record:', latestRecord);

        console.log('Fetching goals progress');
        const goalsProgress = await goalHelper.getGoalsProgress(userId);
        console.log('Goals progress:', goalsProgress);

        console.log('Fetching recent activity');
        const recentActivity = await getRecentActivity(userId);
        console.log('Recent activity:', recentActivity);

        console.log('Fetching user name');
        const user = await userHelper.getUserById(userId);
        console.log('User:', user);

        res.send({
            userName: user.name,
            latestRecord,
            goalsProgress,
            recentActivity
        });
    } catch (error) {
        console.error('Error fetching overview data:', error);
        res.status(500).send({ error: error.message });
    }
});

async function getRecentActivity(userId) {
    try {
        const latestWorkout = await workoutHelper.getLatestWorkout(userId);
        const latestMeal = await nutritionHelper.getLatestMeal(userId);

        return {
            latestWorkout,
            latestMeal
        };
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        throw error;
    }
}

module.exports = router;
