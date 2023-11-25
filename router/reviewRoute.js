const express = require('express');
const reviewController = require('../controller/reviewController');
const authController = require('../controller/authController');

const Route = express.Router({ mergeParams: true });

Route.route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    reviewController.setId,
    reviewController.creatReview,
  );

Route.route('/:id').get(authController.protect, reviewController.getReview);
Route.route('/:id').delete(
  authController.protect,
  authController.restrictTo('admin','user'),
  reviewController.deleteReview,
);
Route.route('/:id').patch(
  authController.protect,
  authController.restrictTo('user'),
  reviewController.updateReview,
);

module.exports = Route;
