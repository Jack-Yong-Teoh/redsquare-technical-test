const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/router');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/data', dataRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
