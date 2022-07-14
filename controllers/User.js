const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const RegisterUser = async (req, res) => {
  const {
    name, email, password, repeatPassword,
  } = req.body;
  if (password !== repeatPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Passwords do not match' });
  }
  const user = await User.create({ name, email, password });
  const token = await user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({
      token,
      user: { name: user.name, id: user._id, img: user.selectedFile },
    });
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('no user is found with this E-mail');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('password is not correct');
  }

  const token = await user.createJWT();

  return res
    .status(StatusCodes.OK)
    .json({
      token,
      user: { name: user.name, id: user._id, img: user.selectedFile },
    });
};

const changeUsername = async (req, res) => {
  const { value } = req.body;
  const { id } = req.params;
  if (!value) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Must provide a value' });
  }

  const user = await User.findById(id);
  user.name = value;

  const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
  return res.status(StatusCodes.OK).json(updatedUser?.name);
};

const uploadImage = async (req, res) => {
  const { id } = req.params;
  if (!req.file) return res.status(StatusCodes.BAD_REQUEST).json({ err: 'image is not uploaded' });
  const extension = req.file.mimetype.split('/')[1];
  const updatedImageName = `${id}.${extension}`;
  fs.rename(`./images/${req.file.filename}`, `./images/${updatedImageName}`, () => {
    console.log('\nFile Renamed!\n');
  });
  res.status(StatusCodes.OK).json({ imgName: updatedImageName });
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, repeatPassword } = req.body;
  if (!oldPassword || !newPassword || !repeatPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Please fill out all the fields!' });
  }
  const user = await User.findById(id);
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'Password is not correct' });
  }
  if (newPassword !== repeatPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Passwords do not match' });
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedNewPassword;
  await User.findByIdAndUpdate(id, user, { new: true });
  return res
    .status(StatusCodes.OK)
    .json({ msg: 'Password updated Succesfully' });
};

module.exports = {
  RegisterUser,
  LoginUser,
  changeUsername,
  uploadImage,
  updatePassword,
};
