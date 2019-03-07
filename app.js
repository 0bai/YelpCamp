var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require('connect-flash');

var indexRouter = require("./routes/index");
var campgroundsRouter = require("./routes/campgrounds");
var commentsRouter = require("./routes/comments");
var app = express();
var seedDB = require("./public/javascripts/seeds");
var argv = require("argv");


// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect('mongodb://' + argv.be_ip + ':80/yelp_camp');
//seedDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));
app.use(flash());
// To add the put method
app.use(methodOverride("_method"));


// Passport configurations
app.use(require("express-session")({
	secret: "Obai Alnajjar",
	resave: false,
	saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Global variables PLACEMENT IS IMPORTANT
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.moment = require("moment");
	next();
});

app.use("/", indexRouter);
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/comments", commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render("error");
});
//
// app.listen(3000, "localhost", function () {
// 	console.log("YelpCamp started!");
// });

app.listen(8080, argv.fe_ip);
console.log("App listening on port 8080");

module.exports = app;
