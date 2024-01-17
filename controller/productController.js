const Factory = require('./handleFactory');
const Product = require('../model/productModel');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.getAllProducts = Factory.getAll(Product);
exports.createProduct = Factory.CreateOne;

exports.searchProduct = catchAsync(async (req, res, next) => {
  const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { type: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};
  const data = await Product.find(keyword)
  res.status(200).json({
    data
  })
});

exports.payment = catchAsync(async () => {

  const total = req.query.total

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });

  console.log(paymentIntent.client_secret);
  res.status(201).json({
    clientSecret: paymentIntent.client_secret,
  });
})
