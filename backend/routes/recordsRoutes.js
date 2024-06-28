const express = require('express');
const router = express.Router();
const recordHelper = require('../helpers/recordHelper'); // Ensure this path is correct

// Get all records
router.get('/', (req, res) => {
    const userId = 1; // Assuming a single user for now
    recordHelper.getAllRecords(userId, (err, records) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ data: records });
    });
});

// Add a new record
router.post('/', (req, res) => {
    const userId = 1; // Assuming a single user for now
    const record = req.body;
    recordHelper.createRecord(userId, record, (err, recordId) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ data: { id: recordId } });
    });
});

// Update a record
router.put('/:id', (req, res) => {
    const userId = 1; // Assuming a single user for now
    const recordId = req.params.id;
    const record = req.body;
    recordHelper.updateRecord(userId, recordId, record, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Record updated successfully' });
    });
});

// Delete a record
router.delete('/:id', (req, res) => {
    const userId = 1; // Assuming a single user for now
    const recordId = req.params.id;
    recordHelper.deleteRecord(userId, recordId, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Record deleted successfully' });
    });
});

module.exports = router;
