const express = require('express')
const ProductController = require('../controller/productController')

const Route = express.Router();

Route.get('/',ProductController.getAllProducts)
Route.get('/search',ProductController.searchProduct)
Route.post('/',ProductController.createProduct)
Route.post('/payment/:total')

module.exports = Route;