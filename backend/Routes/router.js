const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();

const uri = 'mongodb+srv://admin:admin123@mydatabase.53nmflx.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase';
const client = new MongoClient(uri, {});

async function connect() {
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Yes Lah! Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

connect();

// validation use geh
function validateTask(data) {
    const { key, status, priority, title, description, dateCreated, dateDue } = data;
    const validStatuses = ['undone', 'in-progress', 'done'];
    const validPriorities = ['high', 'medium', 'low'];

    return (
        typeof key === 'string' &&
        validStatuses.includes(status) &&
        validPriorities.includes(priority) &&
        typeof title === 'string' &&
        typeof description === 'string' &&
        !isNaN(Date.parse(dateCreated)) &&
        !isNaN(Date.parse(dateDue))
    );
}

//get the data
router.get('/', async (req, res) => {
    try {
        const database = client.db('Redsquare');
        const collection = database.collection('task');
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

// add data
router.post('/', async (req, res) => {
    try {
        const newData = req.body;
        if (!validateTask(newData)) {
            return res.status(400).json({ error: 'Invalid task data' });
        }
        const database = client.db('Redsquare');
        const collection = database.collection('task');
        const result = await collection.insertOne(newData);
        res.status(201).json(result.insertedId);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Failed to add data?' });
    }
});

// edit data
router.put('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const updatedData = req.body;
        if (!validateTask(updatedData)) {
            return res.status(400).json({ error: 'Invalid task data' });
        }
        const database = client.db('Redsquare');
        const collection = database.collection('task');
        const result = await collection.updateOne({ key }, { $set: updatedData });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(updatedData);
    } catch (error) {
        console.error('Error edit task', error)
        res.status(500).json({ error: 'Failed to update data' });
    }
});

// delete data
router.delete('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const database = client.db('Redsquare');
        const collection = database.collection('task');
        const result = await collection.deleteOne({ key });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete data' });
    }
});

module.exports = router;
