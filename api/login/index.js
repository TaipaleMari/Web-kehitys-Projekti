const fs = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    context.res = {
      status: 400,
      body: { message: "Sähköposti ja salasana vaaditaan" }
    };
    return;
  }

  const filePath = path.join(__dirname, '../../backend/users.json');
  let users = [];

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    users = JSON.parse(data);
  } catch (err) {
    context.res = {
      status: 500,
      body: { message: "Palvelinvirhe käyttäjätietojen lukemisessa" }
    };
    return;
  }

  const user = users.find(u => u.username === email && u.password === password);

  if (user) {
    context.res = {
      status: 200,
      body: { username: user.username }
    };
  } else {
    context.res = {
      status: 401,
      body: { message: "Virheellinen kirjautuminen" }
    };
  }
};
