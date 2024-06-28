const db = require('../db');

exports.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT name FROM users WHERE id = ?';
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.error('Error fetching user:', err);
                return reject(err);
            }
            resolve(row);
        });
    });
};
