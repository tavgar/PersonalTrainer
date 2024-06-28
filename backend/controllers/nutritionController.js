const nutritionHelper = require('../helpers/nutritionHelper');

exports.getAllNutrition = (req, res) => {
    const userId = 1; // Hardcoded user ID
    nutritionHelper.getAllNutrition(userId, (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
};

exports.createNutrition = (req, res) => {
    const userId = 1; // Hardcoded user ID
    const nutrition = req.body;
    nutritionHelper.createNutrition(userId, nutrition, (err, id) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id });
    });
};

exports.updateNutrition = (req, res) => {
    const userId = 1; // Hardcoded user ID
    const { id } = req.params;
    const nutrition = req.body;
    nutritionHelper.updateNutrition(userId, id, nutrition, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updatedID: id });
    });
};

exports.deleteNutrition = (req, res) => {
    const userId = 1; // Hardcoded user ID
    const { id } = req.params;
    nutritionHelper.deleteNutrition(userId, id, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deletedID: id });
    });
};
exports.getLatestMeal = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM nutrition WHERE user_id = ? ORDER BY date DESC LIMIT 1';
        db.get(sql, [userId], (err, meal) => {
            if (err) {
                return reject(err);
            }
            resolve(meal);
        });
    });
};