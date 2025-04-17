const fs = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    context.res = {
      status: 400,
      body: { message: "Käyttäjätunnus ja salasana vaaditaan" }
    };
    return;
  }

  const filePath = path.join(__dirname, '../../backend/users.json');
  let users = [];

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    users = JSON.parse(data);
  } catch (err) {
    users = [];
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    context.res = {
      status: 409,
      body: { message: "Käyttäjänimi on jo käytössä" }
    };
    return;
  }

  users.push({ username, password });
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  context.res = {
    status: 200,
    body: { message: `Käyttäjä ${username} rekisteröity!` }
  };
};
