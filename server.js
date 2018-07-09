// ## requires, basic setups and stuff ##
var express      = require("express");
var app          = express();
var port         = process.env.PORT || 1301;

var mongoose     = require("mongoose");
var passport     = require("passport");
var flash        = require("connect-flash");

var morgan       = require("morgan");
var path         = require('path');
var cookieParser = require("cookie-parser");
var bodyParser   = require("body-parser");
var session      = require("express-session");

var color        = require('cli-color');

// ## config and advanced setup crap going on ##
mongoose.connect("mongodb://127.0.0.1:27017/test", { useMongoClient: true });

require("./config/passport.js")(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, 'public')));

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ 
    secret: 'lovingniggassince1948666damnbro', 
    saveUninitialized: true, 
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// ## routes stuff ##
require("./app/routes.js")(app, passport);


// ## driver nigga ##
app.listen(port);
console.log("Nigga your server started on: "+ color.blueBright(port));