const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError =require('../utils/AppError')

exports.getAllTours = catchAsync(async (req, res) => {
  const tour = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tour',
    tours: tour,
  });
});

exports.getTour = catchAsync(async (req, res,next) => {
  
  const slug = req.params.slug;

  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review user rating',
  });

if(!tour){
  req.originalUrl= '/error'
  return next(new AppError('there is no tour with this name',404))
}

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    )
    .render('tour', {
      title: `${tour.title === undefined ? slug : tour.title} Tour`,
      tour,
    });

  // res.status(200).render('tour', {
  //   title: `${tour.name} Tour`,
  //   tour
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  res
    .status(200).set(
      'Content-Security-Policy',
      "default-src 'self' https://*.axios.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.axios.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests; connect-src 'self' http://127.0.0.1:3300",
    )
    .render('login', {
      title: 'Login to your page',
    });
});

exports.getMyAccount = async(req,res,next)=>{

    res.status(200).render('account',{
title:'your account '
    })
  
  }
