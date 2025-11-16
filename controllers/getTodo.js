let todos = [
  { id: 1, task: 'Learn Node.js', completed: true },
  { id: 2, task: 'Build CRUD API', completed: false },
];

const getTodo = (req, res, next) => {
  return res.status(200).json(todos);
};

module.exports = getTodo;
