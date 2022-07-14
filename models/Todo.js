const mongoose = require('mongoose');

const ToDoSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'must provide name'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'must provide the user'],
    },
  },
  { timeStamps: true },
);

module.exports = mongoose.model('Todo', ToDoSchema);
