const express = require('express');
const router = express.Router();
const db = require('../db');

// Get body weight distribution data
router.get('/body-weight-distribution', (req, res) => {
    const userId = 1; // Assuming a single user for now
    const sql = 'SELECT fat, muscles FROM records WHERE user_id = ? ORDER BY date DESC LIMIT 1';
    db.get(sql, [userId], (err, row) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ data: row });
    });
});

module.exports = router;
