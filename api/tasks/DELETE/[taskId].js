const tasks = [];

module.exports = async function (context, req) {
  const taskId = parseInt(context.bindingData.taskId);

  const index = tasks.findIndex(task => task.id === taskId);

  if (index === -1) {
    context.res = {
      status: 404,
      body: { message: 'Tehtävää ei löydy' }
    };
    return;
  }

  tasks.splice(index, 1);

  context.res = {
    status: 200,
    body: { message: 'Tehtävä poistettu' }
  };
};
