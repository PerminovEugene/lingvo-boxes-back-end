const passport = require('./../utils/passport').initialize()
    , authController = require('./../controllers/auth')
    , auth = require('./../servises/auth');

module.exports = (app) => {
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    // local strategy
    // expected attributes in body: email, password
    app.post('/login', passport.authenticate('local'), authController.login);
    
    app.post('/logout', auth.loggedIn, authController.logout);
    
    // expected attributes in body: email, password, passwordConfirm, firstName, lastName
    app.post('/registration', authController.registration);


    // twitter strategy
    // Redirect the user to Twitter for authentication.  When complete, Twitter
    // will redirect the user back to the application at
    //   /auth/twitter/callback
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // Twitter will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter'), authController.afterTwitterLogin
    );
    
    app.post('/delete-account', auth.loggedIn, authController.deleteAccount);
};
