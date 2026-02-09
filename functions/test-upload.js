const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

const form = new FormData();
form.append('name', 'Test User');
form.append('email', 'test@example.com');
form.append('phone', '0123456789');
form.append('message', 'Test message');

// Create a test file
const testFile = Buffer.from('test file content');
form.append('attachment0', testFile, {filename: 'test.txt'});

const req = http.request({
  method: 'post',
  host: 'localhost',
  port: 5001,
  path: '/studiovert-site/us-central1/api/contact',
  headers: form.getHeaders()
}, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
});

form.pipe(req);
