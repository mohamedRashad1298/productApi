const Review = require('../model/reviewModel');
const handelFactory = require('./handelFactory');

exports.setId = (req,res,next)=>{
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next()
}


exports.getAllReviews = handelFactory.getAll(Review);
exports.creatReview = handelFactory.CreateOne(Review);
exports.getReview = handelFactory.getOne(Review);
exports.deleteReview = handelFactory.DeleteOne(Review);
exports.updateReview = handelFactory.UpdateOne(Review);
