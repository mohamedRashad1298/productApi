const express = require('express');
const tourController = require('../controller/tourController');
const AuthController = require('../controller/authController');
const reviewRouter = require('../router/reviewRoute')


const Route = express.Router();

Route.route('/tour-within/:distance/center/:latlng/unit/:unit').get(tourController.getTourWithIn)
Route.route('/distance/center/:latlng/unit/:unit').get(tourController.nearDistance)
Route.use('/:tourId/reviews',reviewRouter)

Route.route('/tour-status').get(tourController.toursStatus);
Route.route('/month-plan/:year').get(tourController.monthPlan);

Route.route('/top-5-cheap-tours').get(
  tourController.alaisTopTour,
  tourController.getAlltours,
);

Route.route('/')
  .get( tourController.getAlltours)
  .post(AuthController.protect,AuthController.restrictTo('admin','lead-guide'),tourController.createTour);

Route.route('/:id')
  .get(tourController.getOneToure)
  .patch(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// Route.route('/:tourId/reviews').post(
//   AuthController.protect,
//   AuthController.restrictTo('user'),
//   reviewController.creatReview,
// );

// Route.route('/:tourId/reviews').get(
//   reviewController.getReviewsForTour,
// );

module.exports = Route;
