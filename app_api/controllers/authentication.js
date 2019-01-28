//things we gon need
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}

/*The register controller will need to do the following:
1 Validate that the required fields have been sent.
2 Create a new model instance of User.
3 Set the name and email address of the user.
4 Use the setPassword method to create and add the salt and the hash.
5 Save the user.
6 Return a JWT when saved.*/
//register controller
module.exports.register = function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    var user = new User();

    user.name = req.body.name;
    user.email = req.body.email;

    //set password
    user.setPassword(req.body.password);

    user.save(function (err) {
        var token;
        if (err) {
            sendJSONresponse(res, 404, err);
        } else {
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token": token
            });
        }
    });
};

/*The login controller will rely on Passport to do the difficult stuff. We’ll start by simply
validating that the required fields have been filled, and then hand over everything to
Passport. Passport will do its thing—attempting to authenticate the user using the
strategy we specify—and then tell us whether it was successful or not. If it was successful
we can use the*/
//login controller
module.exports.login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields req'ed"
        });
        return;
    }

    passport.authenticate('local', function (err, user, info) {
        var token;

        if (err) {
            sendJSONresponse(res, 404, err);
            return;
        }

        if (user) {
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token": token
            });
        } else {
            sendJSONresponse(res, 401, info);
        }
    })(req, res);
};