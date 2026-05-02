const axios = require('axios');

const API_KEY = 'ee274cc5b5da7379d2db620250fab481';
const city = 'Jalandhar';
const url = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`;

console.log('Testing Weatherstack API...');
console.log('URL:', url.replace(API_KEY, 'HIDDEN'));

axios.get(url)
    .then(response => {
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    })
    .catch(error => {
        console.error('Error Status:', error.response ? error.response.status : 'N/A');
        console.error('Error Data (First 500 chars):', error.response ? JSON.stringify(error.response.data).substring(0, 500) : error.message);
    });
