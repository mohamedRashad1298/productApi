const path = require('path')
const express = require('express');
const morgan = require('morgan');
const userRoute = require('./router/userRoute');
const productRoute = require('./router/productRoute')
const AppError = require('./utils/AppError');
const compression = require('compression')
const cors=require('cors')
const cookieParser = require('cookie-parser')
const globalHandeler = require('./controller/errorController')

const app = express();
app.use(cors({origin:true}))
app.use(cookieParser())

app.use(compression())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(express.static(path.join(__dirname,'public')));

app.use(express.json({ limit: '10kb' }));

app.use('/api/product',productRoute)
app.use('/api/users', userRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalHandeler);

module.exports = app;
