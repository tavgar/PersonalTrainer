const db = require('../db');

exports.getAllWorkouts = (userId, callback) => {
    const sql = 'SELECT * FROM workouts WHERE user_id = ?';
    db.all(sql, [userId], callback);
};

exports.createWorkout = (userId, workout, callback) => {
    const { date, type, duration, calories } = workout;
    const isoDate = new Date(date).toISOString();
    const sql = 'INSERT INTO workouts (user_id, date, type, duration, calories) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [userId, isoDate, type, duration, calories], function(err) {
        callback(err, this ? this.lastID : null);
    });
};

exports.updateWorkout = (userId, id, workout, callback) => {
    const { date, type, duration, calories } = workout;
    const sql = 'UPDATE workouts SET date = ?, type = ?, duration = ?, calories = ? WHERE id = ? AND user_id = ?';
    db.run(sql, [date, type, duration, calories, id, userId], callback);
};

exports.deleteWorkout = (userId, id, callback) => {
    const sql = 'DELETE FROM workouts WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], callback);
};

exports.getLatestWorkout = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC LIMIT 1';
        db.get(sql, [userId], (err, workout) => {
            if (err) {
                console.error('Error fetching latest workout:', err);
                return reject(err);
            }
            resolve(workout);
        });
    });
};
