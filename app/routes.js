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
        successRedirect : '/totp-verify',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.get('/totp-verify', (req, res) => {
        let otpUrl  = 'otpauth://totp/Don (' + req.user.local.email + ')?secret=' + req.user.local.secret;
        let qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);
        res.render('totp.ejs', { qr_url: qrImage, message: req.flash('totpLoginMessage') }); 
    });

    app.post('/totp-verify', passport.authenticate('totp-login', {
        successRedirect : '/profile',
        failureRedirect : '/totp-verify',
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