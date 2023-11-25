const express = require('express');
const Route = express.Router();
const userController = require('../controller/userController');
const AuthController = require('../controller/authController');

Route.post('/signup', AuthController.signUp);
Route.post('/login', AuthController.logIn);

Route.post('/forgotpassword', AuthController.forgotPassword);
Route.patch('/resetpassword/:token', AuthController.resetPassword);
Route.use(AuthController.protect);
Route.patch('/update-password', AuthController.updatePassword);

Route.patch(
  '/update-me',
  userController.uploadUserPhoto,
  userController.resizePhoto,
  userController.updateMe,
);
Route.delete('/delete-me', userController.deleteMe);

Route.get('/me', userController.setMyId, userController.getMe);
// Route.post('/', userController.createUser);
Route.use(
  AuthController.protect,
  AuthController.restrictTo('admin', 'lead-guide'),
);

Route.get('/', userController.getAllUsers);
Route.get('/:id', userController.findUser);
Route.patch('/:id', userController.updateUser);
Route.delete('/:id', userController.deleteUser);

module.exports = Route;
