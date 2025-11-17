const axios = require('axios');

const AUTOMATION_SERVICE_URL = process.env.AUTOMATION_SERVICE_URL || 'http://localhost:8000';

const notifyUserRegistration = async (userData) => {
  try {
    const response = await axios.post(`${AUTOMATION_SERVICE_URL}/api/automation/user-registered`, {
      userId: userData.id,
      email: userData.email,
      username: userData.username
    });
    
    console.log('Automation service notified:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to notify automation service:', error.message);
    // Don't throw error to avoid breaking user registration
  }
};

module.exports = {
  notifyUserRegistration
};