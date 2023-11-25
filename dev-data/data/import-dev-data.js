const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../model/tourModel');
const User = require('../../model/userModel');
const Review = require('../../model/reviewModel');

dotenv.config({ path: './config.env' });

// const localDB = process.env.LOCAL_DB;

// console.log(localDB);

// mongoose.connect(localDB).then(() => {
//   console.log('DB connected');
// });

const { DB } = process.env;
const password = process.env.PASSWORD;

mongoose.connect(DB.replace('<password>', password)).then(() => {
  console.log('DB connected');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
// );
// IOMPRT JSON

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users,{validateBeforeSave:false});
    await Review.create(reviews);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//  Delete Data

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
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
