const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum:['electronics','clothes','sports','kitchen','accessories']
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, 
  },
  image:String,
},{
timestamps:true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;