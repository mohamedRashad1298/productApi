const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../model/tourModel');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('./../utils/catchAsync');

const handelFactory = require('./handelFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError('no an image uploaded ,please aupload only images', 400),
      false,
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jepg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg()
    .toFile(`public/img/tours/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (el, i) => {
      const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jepg`;
      await sharp(el.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg()
        .toFile(`public/img/tours/${fileName}`);
      req.body.images.push(fileName);
    }),
  );

  next();
};

exports.alaisTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage,price';
  req.query.fields = 'name,price,duration,ratingAverage,summery,difficulty';
  next();
};

exports.getAlltours = handelFactory.getAll(Tour);
exports.createTour = handelFactory.CreateOne(Tour);
exports.getOneToure = handelFactory.getOne(Tour, { path: 'reviews' });
exports.updateTour = handelFactory.UpdateOne(Tour);
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const tours = await Tour.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidatore: true,
//   });

//   res.status(200).json({
//     status: 'success',
//     tours,
//   });
// });

exports.deleteTour = handelFactory.DeleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const tours = await Tour.findByIdAndDelete(id);

//   res.status(200).json({
//     status: 'success',
//     message: 'deleted',
//     tours,
//   });
// });

exports.toursStatus = catchAsync(async (req, res, next) => {
  const tours = await Tour.aggregate([
    {
      $match: { price: { $gte: 2000 } },
    },
    {
      $group: { _id: null, avgprice: { $avg: '$price' } },
    },
  ]);

  res.status(200).json({
    status: 'success',
    tours,
  });
});

exports.monthPlan = catchAsync(async (req, res) => {
  const { year } = req.params;

  const tours = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-12`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tour: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    tours,
  });
});

exports.getTourWithIn = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const AcceptedUnit = ['mi', 'km'];
  if (!AcceptedUnit.includes(unit)) {
    next(
      new AppError(`sorry but units must be in mile(mi) or kilometer(km)`, 400),
    );
  }

  const radius = unit === 'km' ? distance / 6378.1 : distance / 3963.2;

  console.log(radius);
  if (!lat || !lng) {
    next(
      new AppError(
        `please Provide latitur and langitude in the format of lat ,lng`,
        400,
      ),
    );
  }

  const tour = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  }).explain();

  res.status(200).json({
    status: 'success',
    results: tour.length,
    tour,
  });
});

exports.nearDistance = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const AcceptedUnit = ['mi', 'km'];
  if (!AcceptedUnit.includes(unit)) {
    next(
      new AppError(`sorry but units must be in mile(mi) or kilometer(km)`, 400),
    );
  }
  const multiplier = unit === 'mi' ? 0.000621371192 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        `please Provide latitur and langitude in the format of lat ,lng`,
        400,
      ),
    );
  }

  const tour = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

// /tour-within/:distance/center/:lat lng/unit/:unit
