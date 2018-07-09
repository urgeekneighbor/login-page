// ## load them bitches up ##
var localStrategy = require("passport-local").Strategy;

// ## get user models ##
var User          = require("../app/models/user.js");


// ## where the passport happens ##
module.exports = (passport) => {

    // ## passport setup ##
    // * serialize user *
    passport.serializeUser((user, done) => {
         done(null, user.id);
    });

    // * deserialize user *
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });


    // ## local login ##
    passport.use('local-login', new localStrategy({
        usernameField : 'email',
        passwordField : 'code',
        passReqToCallback : true
        
    }, (req, email, code, done) => {
        User.findOne({ 'local.email' :  email }, (err, user) => {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found!'));

            if (!user.validateCode(user.local.secret, code) && !user.validateBackup(code, user.local.backup_codes))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong code!'));

            user.local.backup_codes.one = user.generateBackup();
            
            user.save((err) => {
                if(err)
                    throw err;
                    
                return done(null, user);
            });
        });
    }));


    // ## local signup ##
    passport.use('local-signup', new localStrategy({
        usernameField: 'email',
        passwordField: 'email',
        passReqToCallback: true

    }, (req, email, password, done) => {
        process.nextTick(() => {
            User.findOne({ 'local.email': email }, (err, user) => {
                if(err) 
                    return done(err);

                if(user)
                    return done(null, false, req.flash('signupMessage', 'That email is already taken!'));

                else {
                    let newbie = new User();

                    newbie.local.email            = email;
                    newbie.local.secret           = newbie.generateSecret();
                    newbie.local.backup_codes.one = newbie.generateBackup();

                    newbie.save((err) => {
                        if(err)
                            throw err;
                        
                        return done(null, newbie);
                    });
                }
            });
        });
    }));

    passport.use('totp-login', new localStrategy({
        usernameField : 'code',
        passwordField : 'code',
        passReqToCallback : true
        
    }, (req, email, code, done) => {
        User.findOne({ 'local.email' :  req.user.local.email }, (err, user) => {
            if (err)
                return done(err);

            if (!user.validateCode(user.local.secret, code))
                return done(null, false, req.flash('totpLoginMessage', 'Oops! Wrong code!'));

            return done(null, user);
        });
    }));
};