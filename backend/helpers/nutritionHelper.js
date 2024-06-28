const db = require('../db');

exports.getAllNutrition = (userId, callback) => {
    const sql = 'SELECT * FROM nutrition WHERE user_id = ?';
    db.all(sql, [userId], callback);
};

exports.createNutrition = (userId, nutrition, callback) => {
    const { date, meal, food, calories } = nutrition;
    const sql = 'INSERT INTO nutrition (user_id, date, meal, food, calories) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [userId, date, meal, food, calories], function(err) {
        callback(err, this ? this.lastID : null);
    });
};

exports.updateNutrition = (userId, id, nutrition, callback) => {
    const { date, meal, food, calories } = nutrition;
    const sql = 'UPDATE nutrition SET date = ?, meal = ?, food = ?, calories = ? WHERE id = ? AND user_id = ?';
    db.run(sql, [date, meal, food, calories, id, userId], callback);
};

exports.deleteNutrition = (userId, id, callback) => {
    const sql = 'DELETE FROM nutrition WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], callback);
};

exports.getLatestMeal = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM nutrition WHERE user_id = ? ORDER BY date DESC LIMIT 1';
        db.get(sql, [userId], (err, meal) => {
            if (err) {
                console.error('Error fetching latest meal:', err);
                return reject(err);
            }
            resolve(meal);
        });
    });
};
