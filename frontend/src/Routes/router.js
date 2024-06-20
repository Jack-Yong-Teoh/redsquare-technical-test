import axios from 'axios';

export const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/data');
        return response.data;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};

export const addItem = async (newItem) => {
    try {
        await axios.post('http://localhost:5000/data', newItem);
    } catch (error) {
        console.error('Error adding item', error);
        throw error;
    }
};

export const updateItem = async (key, updatedItem) => {
    try {
        const response = await axios.put(`http://localhost:5000/data/${key}`, updatedItem);
        return response.data;
    } catch (error) {
        console.error('Error updating item', error);
        throw error;
    }
};

export const deleteItem = async (key) => {
    try {
        const response = await axios.delete(`http://localhost:5000/data/${key}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item', error);
        throw error;
    }
};
