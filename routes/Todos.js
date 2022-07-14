const express = require('express');

const router = express.Router();

const {
  getPaginatedToDos,
  getToDo,
  createToDo,
  updateToDo,
  deleteToDo,
} = require('../controllers/Todo');

router.get('/', getPaginatedToDos);
router.post('/', createToDo);
router.get('/:id', getToDo);
router.patch('/:id', updateToDo);
router.delete('/:id', deleteToDo);

module.exports = router;
