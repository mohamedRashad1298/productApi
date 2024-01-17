const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Product = require('../../model/productModel')


dotenv.config({ path: './config.env' });

const localDB = process.env.LOCAL_DB;

console.log(localDB);

// mongoose.connect(localDB).then(() => {
//   console.log('DB connected');
// });

const { DB } = process.env;
const password = process.env.PASSWORD;

mongoose.connect(DB.replace('<password>', password)).then(() => {
  console.log('DB connected');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/product.json`, 'utf-8'));


const importData = async () => {
  try {
    await Product.create(tours);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//  Delete Data

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
