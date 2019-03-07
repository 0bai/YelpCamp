var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require("passport");




/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {title: 'Yelp Camp'});
});

// show register form
router.get("/register", function(req, res){
	res.render("register", {page: 'register'});
});

//show login form
router.get("/login", function(req, res){
	res.render("login", {page: 'login'});
});

router.get("/logout", function (req,res) {
	req.logout();
	req.flash("success", "Logged You Out");
	res.redirect("/campgrounds");
});


router.post("/register", function (req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function (err, user) {
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function () {
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function (req, res) {});

module.exports = router;
