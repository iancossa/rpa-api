// auth-service/utils/internalAPI.js
const axios = require('axios');

const automationServiceAPI = axios.create({
  baseURL: process.env.AUTOMATION_SERVICE_URL || 'http://localhost:5002', // adjust port
  timeout: 5000,
});

module.exports = automationServiceAPI;
