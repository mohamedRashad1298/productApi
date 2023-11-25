const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController')

const Route = express.Router();

// Route.use(authController.isLoggedIn);
Route.use(authController.me);

Route.get('/', viewController.getAllTours);
Route.get('/tour/:slug', viewController.getTour);
Route.get('/login',viewController.login)
Route.get('/me',viewController.getMyAccount)

module.exports = Route;
