const http = require('http');

const data = JSON.stringify({
  username: "testikäyttäjä",
  email: "testi@example.com",
  password: "salasana123"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';

  res.on('data', chunk => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('Vastaus:', body);
  });
});

req.on('error', error => {
  console.error('Virhe:', error);
});

req.write(data);
req.end();
