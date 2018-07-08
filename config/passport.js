// ## load them bitches up ##
var localStrategy = require("passport-local").Strategy;

// ## get user models ##
var User = require("../app/models/user.js");


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
        passwordField : 'password',
        passReqToCallback : true
        
    }, (req, email, password, done) => {
        User.findOne({ 'local.email' :  email }, (err, user) => {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

            return done(null, user);
        });
    }));


    // ## local signup ##
    passport.use('local-signup', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true

    }, (req, email, password, done) => {
        process.nextTick(() => {
            User.findOne({ 'local.email': email }, (err, user) => {
                if(err) 
                    return done(err);

                if(user)
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

                else {
                    let newbie = new User();

                    newbie.local.email = email;
                    newbie.local.password = newbie.generateHash(password);

                    newbie.save((err) => {
                        if(err)
                            throw err;
                        
                        return done(null, newbie);
                    });
                }
            });
        });
    }));
};