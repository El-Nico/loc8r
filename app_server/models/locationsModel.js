// and this one deals more directly with our app by providing a scheme for our crud operations
// this model serves as a mirror/map to our document
var mongoose = require('mongoose');

var openingTimeSchema= new mongoose.Schema({
    days: {type: String, required: true},
    opening: String,
    closing: String,
    closed: {type: Boolean, required: true}
});

var reviewSchema = new mongoose.Schema({
    author: String,
    rating: {type: Number, required: true, min:0, max:5},
    reviewText: String,
    createdOn: {type: Date, "default": Date.now}
})
var locationSchema= new mongoose.Schema({
    name: {type:String, required: true},
    address: String,
    //default is in quotes but apparently its a reserved word in js so best practice
    rating: {type:Number, "default":0, min:0, max:5},
    facilities: [String],
    coords: {type: [Number], index: '2dsphere'},
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});

//now breathe life into it
mongoose.model('Location', locationSchema);
