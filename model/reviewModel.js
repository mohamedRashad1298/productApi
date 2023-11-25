const mongoose = require('mongoose');
const Tour =require('./tourModel')

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true,'review can not be empaty!']
    },
    rating:{
        type:Number,
        min:[1,`rate Can't be less than 1`],
        max:[5,`rate Can't be more than 5`],
        default:4.9
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    tour:{
      type:mongoose.Schema.ObjectId,
      ref:'Tour',
      required:[true,'Review must have a tour belong to']
    },
    user:{
      type:mongoose.Schema.ObjectId,
      ref:'User',
      required:[true,'Review must have a user belong to']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });

reviewSchema.index({tour : 1, user : 1 },{unique:true})

reviewSchema.pre(/^find/, function(next){

 this.populate({path:'user' , select:'name photo'})
    next()
})

reviewSchema.statics.calcAverageRating = async function(tourId){

 const stats = await this.aggregate([
    {
      $match:{tour:tourId}
    },
    {
      $group:{
        _id:'$tour',
        nRating:{$sum:1},
        avrgRating:{$avg:'$rating'}
      }
    }
  ])
  if(stats.length >0){
    await Tour.findByIdAndUpdate(tourId,{
      ratingsAverage:stats[0].avrgRating,
      ratingsQuantity:stats[0].nRating,
  })}else{
    await Tour.findByIdAndUpdate(tourId,{
      ratingsAverage:4.5,
      ratingsQuantity:0,
  })}

}

reviewSchema.post('save',function(){
  this.constructor.calcAverageRating(this.tour);

})

reviewSchema.pre(/^findOneAnd/,async  function(next) {
  this.r = await this.clone().findOne();

  next();
});


reviewSchema.post(/^findOneAnd/, async function(doc, next) {
  // doc parameter represents the document returned by the query
    await this.r.constructor.calcAverageRating(this.r.tour);
 
  next();
});


const Review = new mongoose.model('Review',reviewSchema);

module.exports = Review