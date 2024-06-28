const db = require('../db');

exports.getAllRecords = (userId, callback) => {
    const sql = 'SELECT id, user_id, weight, fat, muscles, date FROM records WHERE user_id = ?';
    db.all(sql, [userId], (err, records) => {
        if (err) {
            return callback(err);
        }
        callback(null, records);
    });
};

exports.createRecord = (userId, record, callback) => {
    const { weight, fat, muscles, date } = record;
    const isoDate = new Date(date).toISOString().split('T')[0]; // Convert to ISO 8601 format
    const sql = 'INSERT INTO records (user_id, weight, fat, muscles, date) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [userId, weight, fat, muscles, isoDate], function(err) {
        callback(err, this ? this.lastID : null);
    });
};

exports.updateRecord = (userId, id, record, callback) => {
    const { weight, fat, muscles, date } = record;
    const isoDate = new Date(date).toISOString().split('T')[0]; // Convert to ISO 8601 format
    const sql = 'UPDATE records SET weight = ?, fat = ?, muscles = ?, date = ? WHERE id = ? AND user_id = ?';
    db.run(sql, [weight, fat, muscles, isoDate, id, userId], (err) => {
        callback(err);
    });
};

exports.deleteRecord = (userId, id, callback) => {
    const sql = 'DELETE FROM records WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], (err) => {
        callback(err);
    });
};

exports.getLatestRecord = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM records WHERE user_id = ? ORDER BY date DESC LIMIT 1';
        db.get(sql, [userId], (err, record) => {
            if (err) {
                console.error('Error fetching latest record:', err);
                return reject(err);
            }
            resolve(record);
        });
    });
};

