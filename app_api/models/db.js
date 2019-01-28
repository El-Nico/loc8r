//this file sort of maintains the online offline state of the database connection
var mongoose = require('mongoose');
var gracefulShutdown;

//connections string and create a connection to database
var dbURI = 'mongodb://localhost/Loc8r';
//process.env.NODE_ENV= 'production';
if (process.env.NODE_ENV === 'production') {
    dbURI = 'mongodb://el-nico-loc8r:123%40abc2@ds251223.mlab.com:51223/loc8rb-cloud';
}
//mongoose.connect(dbURI);
mongoose.connect(dbURI, {
    uri_decode_auth: true
}, function (err, db) {

}, { useNewUrlParser: true }
);
var readLine = require("readline");
if (process.platform === "win32") {
    var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}



mongoose.connection.on('connected', function () {
    console.log('Mongoose adigo connected onto ' + dbURI + ' aka obago');
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error aah oginidi: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose alago');
})

gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

//for nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

//for app termination
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

//For Heroku app termination
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown -- Hero out', function () {
        process.exit(0);
    });
});

require('./locationsModel');
require('./users');