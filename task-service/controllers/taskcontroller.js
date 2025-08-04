const sendToQueue = require('../mq/publisher');

exports.assignTask = async (req, res) => {
  const { title, assignedTo } = req.body;

  // Save task to DB (not shown here)

  await sendToQueue({
    type: 'TASK_ASSIGNED',
    to: assignedTo,
    title,
    timestamp: Date.now()
  });

  res.status(201).json({ message: 'Task assigned and message sent' });
};
