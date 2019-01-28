/*Note that we don’t specify /api at the front of the path. We specify in app.js that these
routes should only be used if the path starts with /api, so it’s assumed that all routes
specified in this file will be prefixed with /api.*/ 
var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');
var ctrlAuth = require('../controllers/authentication')
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

//locations
//get all locations by distance near to each other using geonear
router.get('/locations', ctrlLocations.locationsListByDistance);
//create one location
router.post('/locations', ctrlLocations.locationsCreate);
//get one location
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
//update one location
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);
//delete one location
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);

//reviews
//create one new review
router.post('/locations/:locationid/reviews', auth, ctrlReviews.reviewsCreate);
//get one review
router.get('/locations/:locationid/review/:reviewid', ctrlReviews.reviewsReadOne);
//update one review
router.put('/locations/:locationid/review/:reviewid', auth,ctrlReviews.reviewsUpdateOne);
//delete a review
router.delete('/locations/:locationid/review/:reviewid', auth, ctrlReviews.reviewsDeleteOne);

//authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports= router;