const workoutHelper = require('../helpers/workoutHelper');

exports.getAllWorkouts = (req, res) => {
    const userId = 1; // Hardcoded user ID
    workoutHelper.getAllWorkouts(userId, (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
};

exports.createWorkout = (req, res) => {
    const userId = 1; // Hardcoded user ID
    const workout = req.body;
    workoutHelper.createWorkout(userId, workout, (err, id) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id });
    });
};

exports.updateWorkout = (req, res) => {
    const userId = 1; // Hardcoded user ID
    const { id } = req.params;
    const workout = req.body;
    workoutHelper.updateWorkout(userId, id, workout, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updatedID: id });
    });
};

exports.deleteWorkout = (req, res) => {
    const userId = 1; // Hardcoded user ID
    const { id } = req.params;
    workoutHelper.deleteWorkout(userId, id, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deletedID: id });
    });
};
exports.getLatestWorkout = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC LIMIT 1';
        db.get(sql, [userId], (err, workout) => {
            if (err) {
                return reject(err);
            }
            resolve(workout);
        });
    });
};