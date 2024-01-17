const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handelFactory = require('./handleFactory');
const multer = require('multer');
const sharp = require('sharp');


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

exports.uploadUserPhoto = upload.single('photo');

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpg`;

await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .toFile(`public/img/users/${req.file.filename}`);

    next()
};

exports.updateMe = catchAsync(async (req, res, next) => {

  // console.log(req.body)
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this Route is not for update password go to restPassword route',
      ),
      400,
    );
  }
  const id = req.user.id;

  const filterbody = filterObject(req.body, 'name', 'email');
  if (req.file) filterbody.photo = req.file.filename;

  const user = await User.findByIdAndUpdate(id, filterbody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user,
  });
});

const filterObject = (obj, ...fields) => {
  const newObjct = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) newObjct[el] = obj[el];
  });
  return newObjct;
};

// get All User
exports.getAllUsers = handelFactory.getAll(User);

// creat User
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    status: 'success',
    user,
  });
});

// find user
exports.findUser = handelFactory.getOne(User);
exports.updateUser = handelFactory.UpdateOne(User);
exports.deleteUser = handelFactory.DeleteOne(User);

exports.setMyId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getMe = handelFactory.getOne(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
  });
});
