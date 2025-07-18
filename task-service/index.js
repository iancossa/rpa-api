const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {});
app.listen(5002, () => {
    console.log('User service is running on port 5002');
});