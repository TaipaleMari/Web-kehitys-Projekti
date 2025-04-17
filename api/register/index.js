module.exports = async function (context, req) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    context.res = {
      status: 400,
      body: { message: "Käyttäjätunnus ja salasana vaaditaan" }
    };
    return;
  }

  context.res = {
    status: 200,
    body: { message: `Käyttäjä ${username} rekisteröity!` }
  };
};

  
