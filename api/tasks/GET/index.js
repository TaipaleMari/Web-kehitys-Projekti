const tasks = [];

module.exports = async function (context, req) {
  const { userId, title, description } = req.body;

  if (!userId || !title) {
    context.res = {
      status: 400,
      body: { message: 'userId ja title ovat pakollisia' }
    };
    return;
  }

  const newTask = {
    id: Date.now(), // yksinkertainen ID
    userId,
    title,
    description: description || ''
  };

  tasks.push(newTask);

  context.res = {
    status: 200,
    body: {
      message: 'Tehtävä lisätty',
      taskId: newTask.id
    }
  };
};
