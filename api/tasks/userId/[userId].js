const tasks = [];

module.exports = async function (context, req) {
  const userId = context.bindingData.userId;

  const userTasks = tasks.filter(task => task.userId == userId);

  context.res = {
    status: 200,
    body: { tasks: userTasks }
  };
};
