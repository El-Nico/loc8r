require('dotenv').load();
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require("uglify-js");
var fs = require('fs');
var passport = require('passport');

require('./app_api/models/db');
require('./app_api/config/passport');

//routes
//var routes = require('./app_server/routes/index');
//api routes
var routesApi = require('./app_api/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

var appClientFiles = [
    fs.readFileSync('app_client/app.js', "utf8"),
    fs.readFileSync('app_client/home/home.controller.js', "utf8"),
    fs.readFileSync('app_client/about/aboutCtrl.controller.js', 'utf8'),
    fs.readFileSync('app_client/common/services/geolocation.service.js', "utf8"),
    fs.readFileSync('app_client/common/services/loc8rdata.service.js', "utf8"),
    fs.readFileSync('app_client/common/filters/formatDistance.filter.js', "utf8"),
    fs.readFileSync('app_client/common/directives/ratingStars/ratingStars.directive.js', "utf8"),
    fs.readFileSync('app_client/common/directives/footerGeneric/footerGeneric.directive.js', "utf8"),
    fs.readFileSync('app_client/common/directives/navigation/navigation.directive.js', "utf8"),
    fs.readFileSync('app_client/common/directives/pageHeader/pageHeader.directive.js', 'utf8'),
    fs.readFileSync('app_client/common/filters/addHtmlLineBreaks.filter.js', 'utf8'),
    fs.readFileSync('app_client/locationDetail/locationDetail.controller.js', 'utf8'),
    fs.readFileSync('app_client/reviewModal/reviewModal.controller.js', 'utf8'),
    fs.readFileSync('app_client/common/services/authentication.js', 'utf8'),
    fs.readFileSync('app_client/auth/login/login.controller.js','utf8'),
    fs.readFileSync('app_client/auth/register/register.controller.js','utf8'),
    fs.readFileSync('app_client/common/directives/navigation/navigation.controller.js', 'utf8')
];
var uglified = uglifyJs.minify(appClientFiles, { compress: false });

fs.writeFile('public/angular/loc8r.min.js', uglified.code, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Script generated and saved: loc8r.min.js');
    }
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//static files like bootstrap, js, angular
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

/*The strategy needs to be defined after the model definitions,
because it needs the user model to exist.Passport should be 
initialized in app.js after the static routes have been defined,
and before the routes that are going to use authentication—in
our case the API routes.*/
//strategy definition
app.use(passport.initialize());

//handle routes
//app.use('/', routes);
//handle api routes
app.use('/api', routesApi);

//possibly analogous to this guy below
//catches everything and passes it to the angular app
//catch-all app.use function will respond to anything
//that makes it this far
app.use(function (req, res) {
    res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
})

// error handlers
//this will cathc errors thrown from auth middleware
//in api - index
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({ "message": err.name + ": " + err.message });
    }
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
