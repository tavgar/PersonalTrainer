const db = require('../db');

exports.getAllGoals = (userId, callback) => {
    const sql = 'SELECT id, user_id, title, description, type, target, date FROM goals WHERE user_id = ?';
    db.all(sql, [userId], (err, goals) => {
        if (err) {
            return callback(err);
        }
        const progressPromises = goals.map(goal => calculateProgress(goal, userId));
        Promise.all(progressPromises).then(goalsWithProgress => {
            callback(null, goalsWithProgress);
        }).catch(err => {
            callback(err);
        });
    });
};

exports.getGoalsProgress = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, user_id, title, description, type, target, date FROM goals WHERE user_id = ?';
        db.all(sql, [userId], (err, goals) => {
            if (err) {
                return reject(err);
            }
            const progressPromises = goals.map(goal => calculateProgress(goal, userId));
            Promise.all(progressPromises).then(goalsWithProgress => {
                resolve(goalsWithProgress);
            }).catch(err => {
                reject(err);
            });
        });
    });
};

function calculateProgress(goal, userId) {
    return new Promise((resolve, reject) => {
        const startDate = new Date(goal.date);
        if (goal.type === 'nutrition') {
            const sql = 'SELECT calories, date FROM nutrition WHERE user_id = ?';
            db.all(sql, [userId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const filteredRows = rows.filter(row => new Date(row.date) >= startDate);
                const totalCalories = filteredRows.reduce((sum, row) => sum + row.calories, 0);
                const progress = Math.min(100, Math.round((totalCalories / goal.target) * 100));
                resolve({ ...goal, progress });
            });
        } else if (goal.type === 'weight') {
            const sql = 'SELECT weight, date FROM records WHERE user_id = ?';
            db.all(sql, [userId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const filteredRows = rows.filter(row => new Date(row.date) >= startDate);
                if (filteredRows.length === 0) {
                    resolve({ ...goal, progress: 0 });
                } else {
                    const latestRecord = filteredRows.reduce((latest, row) => new Date(row.date) > new Date(latest.date) ? row : latest, filteredRows[0]);
                    const targetWeight = parseFloat(goal.target); // Ensure target weight is a number
                    const weightProgress = Math.min(100, Math.max(0, Math.round((latestRecord.weight / targetWeight) * 100)));
                    resolve({ ...goal, progress: weightProgress });
                }
            });
        } else if (goal.type === 'workout') {
            const sql = 'SELECT calories, date FROM workouts WHERE user_id = ?';
            db.all(sql, [userId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const filteredRows = rows.filter(row => new Date(row.date) >= startDate);
                const totalCaloriesBurn = filteredRows.reduce((sum, row) => sum + row.calories, 0);
                const progress = Math.min(100, Math.round((totalCaloriesBurn / goal.target) * 100));
                resolve({ ...goal, progress });
            });
        } else {
            resolve({ ...goal, progress: 0 });
        }
    });
}


exports.createGoal = (userId, goal, callback) => {
    const { title, description, type, target, date } = goal;
    const isoDate = new Date(date).toISOString().split('T')[0]; // Convert to ISO 8601 format and strip time
    const sql = 'INSERT INTO goals (user_id, title, description, type, target, date) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [userId, title, description, type, target, isoDate], function(err) {
        callback(err, this ? this.lastID : null);
    });
};

exports.updateGoal = (userId, id, goal, callback) => {
    const { title, description, type, target, date } = goal;
    const isoDate = new Date(date).toISOString().split('T')[0]; // Convert to ISO 8601 format and strip time
    const sql = 'UPDATE goals SET title = ?, description = ?, type = ?, target = ?, date = ? WHERE id = ? AND user_id = ?';
    db.run(sql, [title, description, type, target, isoDate, id, userId], (err) => {
        callback(err);
    });
};

exports.deleteGoal = (userId, id, callback) => {
    const sql = 'DELETE FROM goals WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], (err) => {
        callback(err);
    });
};
