module.exports = (app, passport) => {

    // ################
    // ## Home nigga ## 
    // ################
    
    app.get('/', (req, res) => res.render('index.ejs'));

    // #################
    // ## Login nigga ## 
    // #################
    
    // * display login *
    app.get('/login', (req, res) => res.render('login.ejs', { message: req.flash('loginMessage') }));
    
    // ** process login **
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    // ###################
    // ## Sign-up nigga ## 
    // ###################

    // * display sign-up *
    app.get('/signup', (req, res) => res.render('signup.ejs', { message: req.flash('signupMessage') }));

    // ** process sign-up**
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // ###################
    // ## Profile nigga ## 
    // ###################

    app.get('/profile', isLoggedIn, (req, res) => res.render('profile.ejs', { user: req.user }));

    // ###################
    // ## Log-out nigga ## 
    // ###################

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.redirect('/');
}