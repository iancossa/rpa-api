// auth-service/utils/internalAPI.js
const axios = require('axios');

const automationServiceAPI = axios.create({
  baseURL: process.env.AUTOMATION_SERVICE_URL || 'http://localhost:8000',
  timeout: 5000,
});

module.exports = automationServiceAPI;
