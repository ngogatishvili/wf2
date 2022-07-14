const express = require('express');

const router = express.Router();

const {
  LoginUser, RegisterUser, changeUsername, uploadImage, updatePassword,
} = require('../controllers/User');

const multerMiddleware = require('../middleware/multerMiddleware');

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.patch('/:id/changeusername', changeUsername);
router.patch('/:id/uploadImage', multerMiddleware.single('avatar'), uploadImage);
router.patch('/:id/updatePassword', updatePassword);

module.exports = router;
