var mongoose = require('mongoose');
var loc = mongoose.model('Location');

//get radian distance info for earth
var theEarth = (function () {
    var earthRadius = 6371; //km, miles is 3959

    var getDistanceFromRads = function (rads) {
        return parseFloat(rads + earthRadius);
    };

    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    }
    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    };
})();
//functions for our api routes

//routine function to return json statuts and content
var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//location functions
module.exports.locationsCreate = function (req, res) {
    //create method usess the model to consume data to be saved and executes a callback in the end
    loc.create(
        {
            name: req.body.name,
            address: req.body.address,
            facilities: req.body.facilities.split(","),
            coords: [[arseFloat(req.body.lng), parseFloat(req.body.lat)]],
            openingTimes: [{
                days: req.body.opening1,
                opening: req.body.days1,
                closing: req.body.closing1,
                closed: req.body.closed1,
            }, {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2,
            }]
        }, function (err, location) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                sendJsonResponse(res, 201, location);
            }
        }
    );
};
/*module.exports.locationsListByDistance = function(req, res){
    var lng = parseFloat (req.query.lng);
    var lat = parseFloat (req.query.lat);
    console.log(`this is the longitude ${lng} and this is lat ${lat}`)
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(20),
        num: 10
    };
    if (!lng || !lat) {
        sendJsonResponse(res, 404, {
        "message": "lng and lat query parameters are required"
        });
        return;
    }
    loc.geoNear(point, geoOptions, function(err, results, stats){
        var locations = [];
        if (err) {
            sendJsonResponse(res, 404, err);
            } else {
        results.forEach(function(doc){
            locations.push({
                distance: theEarth.getDistanceFromRads(doc.dis),
                name: doc.obj.name,
                address: doc.obj.address,
                rating: doc.obj.rating,
                facilities: doc.obj.facilities,
                _id: doc.obj._id
            });
        });
        sendJsonResponse(res, 200, locations);
    }
    });
};*/
module.exports.locationsReadOne = function (req, res) {
    if (req.params && req.params.locationid) {
        loc
            .findById(req.params.locationid)
            .exec(function (err, location) {
                if (!location) {
                    sendJsonResponse(res, 404, { "message": "not found" });
                    return;//basically excape the operation
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                //you can put success below in open air because of use of return when failure
                sendJsonResponse(res, 200, location);
            });
    }
    else {
        sendJsonResponse(res, 404, { "message": "No locationid in request" });
    }
};
module.exports.locationsListByDistance = function (req, res) {
    console.log('locationsListByDistance:');
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = 10000;
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    //console.log('point: ' + point)
    var geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(maxDistance),
        num: 10
    };
    //console.log('geoOptions: ' + geoOptions);
    if ((!lng && lng !== 0) || (!lat && lat !== 0) || !maxDistance) {
        console.log('locationsListByDistance missing params');
        sendJsonResponse(res, 404, {
            "message": "lng, lat and maxDistance query parameters are all required"
        });
        return;
    } else {
        //console.log('locationsListByDistance running...');
        loc.aggregate(
            //an array of params
            [{
                '$geoNear': {
                    'near': point,
                    'spherical': true,
                    'distanceField': 'dist.calculated',
                    'maxDistance': maxDistance
                }
            }],
            //and a callback
            function (err, results) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                } else {
                    locations = buildLocationList(req, res, results);
                    sendJsonResponse(res, 200, locations);
                }
            });
    };
};

var buildLocationList = function (req, res, results) {
    console.log('buildLocationList:');
    var locations = [];
    results.forEach(function (doc) {
        locations.push({
            distance: doc.dist.calculated,
            name: doc.name,
            address: doc.address,
            rating: doc.rating,
            facilities: doc.facilities,
            _id: doc._id
        });
    });
    return locations;
};
module.exports.locationsUpdateOne = function (req, res) {
    if (!req.params.locationid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid is required"
        });
        return;
    }
    loc
        .findById(req.params.locationid)
        .select('-reviews -rating')
        .exec(
            function (err, location) {
                if (!location) {
                    sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                location.name = req.body.name;
                location.address = req.body.address;
                location.facilities = req.body.facilities.split(",");
                location.coords = [parseFloat(req.body.lng),
                parseFloat(req.body.lat)];
                location.openingTimes = [{
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1,
                }, {
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2,
                }];
                location.save(function (err, location) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, location);
                    }

                });
            }
        );
};
//The API should respond with a 404 in case of an error and a 204 in case of success for delete methods.
//use find by id and remove
module.exports.locationsDeleteOne = function (req, res) {
    var locationdid = req.params.id;
    if (locationid) {
        loc
            .findByIdAndRemove(locationid)
            .exec(function (err, location) {
                if (err) {
                    sendJsonResponse(res, 404, { "message": "not fucking fojund i wwrote this one wubbalubbadubdbub" });
                    return;
                }
                sendJsonResponse(res, 204, location);
                sendJsonResponse(res, 204, { "message": "successfully removed" });

            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No locationid"
        });
    }
};

