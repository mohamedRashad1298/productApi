const path = require('path')
const express = require('express');
const morgan = require('morgan');
const userRoute = require('./router/userRoute');
const tourRoute = require('./router/tourRoute');
const reviewRoute = require('./router/reviewRoute');
const bookingRoute = require('./router/bookingRoute');
const AppError = require('./utils/AppError');
const globalHandeler = require('./controller/errorController');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const app = express();
const viewController = require('./router/viewRoute')
const cors=require('cors')
const cookieParser = require('cookie-parser')

app.use( helmet() );
// app.use(cookieParser())
app.use(cors())


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));


app.use(express.static(path.join(__dirname,'public')));

const limiter = rateLimiter({
  max:2000,
  windowMs: 3600 * 1000,
  message: 'too many request from this IP ,please try again in an hour',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whiteList: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
    ],
  }),
);
// Run pug



app.use('/', viewController);
app.use('/api/users', userRoute);
app.use('/api/tours', tourRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/bookings', bookingRoute);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status:"Fail",
  //   message:`Can't find ${req.originalUrl} on this server`
  // })
  // const err = new Error(`Can't find ${req.originalUrl} on this server`)
  // err.statusCode = 404;
  // err.status= 'fail'
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalHandeler);

module.exports = app;
