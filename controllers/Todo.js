const { NotFoundError } = require('../errors');
const ToDo = require('../models/Todo');

const todoPerPage = 5;
let page;

const getPaginatedToDos = async (req, res) => {
  page = req.query.page;

  const { userId, name } = req.user;

  const todos = await ToDo.find({ createdBy: userId })
    .skip((page - 1) * todoPerPage)
    .limit(todoPerPage);
  const todoCount = await ToDo.find({ createdBy: userId }).count();

  res.status(200).json({ todos, todoCount, name });
};

const getToDo = async (req, res) => {
  const {
    params: { id: todoId },
    user: { userId },
  } = req;
  const todo = await ToDo.findOne({ _id: todoId, createdBy: userId });
  if (!todo) {
    throw new NotFoundError(`the todoItem with id ${todoId} is not found`);
  }

  res.status(200).json({ todo });
};

const createToDo = async (req, res) => {
  const { userId } = req.user;
  req.body.createdBy = userId;
  const newToDoItem = await ToDo.create(req.body);
  const totalRecordsCount = await ToDo.find({ createdBy: userId }).count();
  const todoItems = await ToDo.find({ createdBy: userId });
  const latestCount = totalRecordsCount % todoPerPage;
  const lastPage = Math.ceil(totalRecordsCount / todoPerPage);
  const latestItems = await ToDo.find({ createdBy: userId })
    .limit(latestCount === 0 ? 5 : latestCount)
    .sort({ $natural: -1 });
  res
    .status(200)
    .json({
      todoItems, totalRecordsCount, latestItems, newToDoItem, lastPage,
    });
};

const updateToDo = async (req, res) => {
  const {
    params: { id: todoId },
    user: { userId },
  } = req;

  const todo = await ToDo.findByIdAndUpdate(
    { _id: todoId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  const todos = await ToDo.find({ createdBy: userId });

  if (!todo) {
    throw new NotFoundError(`The todo item with id ${todoId} does not exist`);
  }

  res.status(200).json({ todo, todos });
};

const deleteToDo = async (req, res) => {
  const {
    params: { id: todoId },
    user: { userId },
  } = req;
  await ToDo.deleteOne({ _id: todoId, createdBy: userId });
  const totalRecordsCount = await ToDo.find({ createdBy: userId }).count();
  const todoItems = await ToDo.find({ createdBy: userId });
  res.status(200).json({ todoItems, totalRecordsCount });
};

module.exports = {
  getPaginatedToDos,
  getToDo,
  createToDo,
  updateToDo,
  deleteToDo,
};
