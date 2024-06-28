const goalHelper = require('../helpers/goalHelper');

exports.getAllGoals = (req, res) => {
    const userId = 1; // Hardcoded user ID
    goalHelper.getAllGoals(userId, (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
};

exports.createGoal = (req, res) => {
    const userId = 1; // Hardcoded user ID
    const goal = req.body;
    goalHelper.createGoal(userId, goal, (err, id) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id });
    });
};

exports.updateGoal = (req, res) => {
    const userId = 1; // Hardcoded user ID
    const { id } = req.params;
    const goal = req.body;
    goalHelper.updateGoal(userId, id, goal, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updatedID: id });
    });
};

exports.deleteGoal = (req, res) => {
    const userId = 1; // Hardcoded user ID
    const { id } = req.params;
    goalHelper.deleteGoal(userId, id, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deletedID: id });
    });
};
