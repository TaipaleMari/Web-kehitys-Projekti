const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

module.exports = async function (context, req) {
  const { taskId } = context.bindingData;
  const { title, description } = req.body;

  if (!taskId || !title) {
    context.res = {
      status: 400,
      body: { message: 'Tehtävän ID ja otsikko vaaditaan.' }
    };
    return;
  }

  db.run(
    `UPDATE tasks SET title = ?, description = ? WHERE id = ?`,
    [title, description, taskId],
    function (err) {
      if (err) {
        context.res = {
          status: 500,
          body: { message: 'Virhe tehtävän päivittämisessä.' }
        };
      } else if (this.changes === 0) {
        context.res = {
          status: 404,
          body: { message: 'Tehtävää ei löytynyt.' }
        };
      } else {
        context.res = {
          status: 200,
          body: { message: 'Tehtävä päivitetty onnistuneesti.' }
        };
      }
    }
  );
};
