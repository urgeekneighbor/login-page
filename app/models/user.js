// ## load shits up ##
var mongoose  = require('mongoose');
var speakeasy = require('speakeasy');


// ## define the schema for our user model ##
var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        secret       : String
    }
});


// ## methods ##
// ** generating a secret **
userSchema.methods.generateSecret = function() {
    return speakeasy.generateSecret().base32;
};

// ** checking if code is valid **
userSchema.methods.validateCode = function(secret, code) {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: String(code)
    });
};


// ** launch the rocket **
module.exports = mongoose.model('User', userSchema);