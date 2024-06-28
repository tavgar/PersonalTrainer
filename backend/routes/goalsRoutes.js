const express = require('express');
const router = express.Router();
const goalHelper = require('../helpers/goalHelper');

router.get('/', (req, res) => {
    const userId = 1; // Hardcoded user ID for example
    goalHelper.getAllGoals(userId, (err, goals) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: goals });
    });
});

router.post('/', (req, res) => {
    const userId = 1; // Hardcoded user ID for example
    const goal = req.body;
    goalHelper.createGoal(userId, goal, (err, id) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id });
    });
});

router.put('/:id', (req, res) => {
    const userId = 1; // Hardcoded user ID for example
    const { id } = req.params;
    const goal = req.body;
    goalHelper.updateGoal(userId, id, goal, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ updatedID: id });
    });
});

router.delete('/:id', (req, res) => {
    const userId = 1; // Hardcoded user ID for example
    const { id } = req.params;
    goalHelper.deleteGoal(userId, id, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deletedID: id });
    });
});

module.exports = router;
