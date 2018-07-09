// ## load shits up ##
var mongoose  = require('mongoose');
var speakeasy = require('speakeasy');


// ## define the schema for our user model ##
var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        secret       : String,
        backup_codes : {
            one      : String
        }
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

userSchema.methods.generateBackup = function() {
    var buf = []
    , chars = 'AlBCaDEFjmcbeinkGgHdoqfIJprhKLsMzNOxtPwyQRuSvTUVWXYZ0123456789@#?'
    , charlen = chars.length;

    for (var i = 0; i < 8; i++) {
     buf.push(chars[Math.floor(Math.random() * (charlen - 2))]);
    }

    return buf.join('');
};

userSchema.methods.validateBackup = function(code, backup_code) {
    return code == backup_code.one;
};


// ** launch the rocket **
module.exports = mongoose.model('User', userSchema);