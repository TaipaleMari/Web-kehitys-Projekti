module.exports = async function (context, req) {
    const { username, password } = req.body || {};
  
    if (!username || !password) {
      context.res = {
        status: 400,
        body: { error: "Käyttäjätunnus ja salasana vaaditaan" }
      };
      return;
    }
  
    // Simppeli testirekisteröinti 
    context.res = {
      status: 200,
      body: { message: `Käyttäjä ${username} rekisteröity!` }
    };
  };
  