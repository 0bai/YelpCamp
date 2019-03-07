var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require("../public/javascripts/index");

//INDEX - show all campgrounds
router.get("/", function (req, res) {
	// Get all campgrounds from DB
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
		}
	});
});

/* Post new Campground */
router.post('/', middleware.isLoggedIn, function (req, res, next) {
	// var {info1, info2, info3} = req.body.arr;
	var camp = req.body.campground;
	camp.author = {
				id: req.user._id,
				username: req.user.username
			}
	Campground.create(camp,
	// 	{
	// 	// name: req.body.name,
	// 	// price: req.body.price,
	// 	// image: req.body.image,
	// 	// description: req.body.description,
	// 	// info: Array.from(Object.values(req.body.arr)),
	// 	author: {
	// 		id: req.user._id,
	// 		username: req.user.username
	// 	}
	// }
	function (err, camp) {
		if (err) {
			console.log(err);
		} else {
			console.log("Camp Created!");
			console.log(camp);
		}
	});
	res.redirect('/campgrounds');
});

/* GET new camp page. */
router.get('/new', middleware.isLoggedIn, function (req, res, next) {
	res.render('campgrounds/new');
});

/* GET camp Info */
router.get('/:id', function (req, res, next) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
		if (err || !foundCamp) {
			req.flash("error", "Campground not found");
			console.log(err);
			res.redirect("back");
		} else {
			res.render('campgrounds/show', {campground: foundCamp});
		}
	});
});

router.get("/:id/edit", middleware.isCampgroundOwner, function (req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		res.render("campgrounds/edit", {campground: campground});
	});
});

router.put("/:id", middleware.isCampgroundOwner, function (req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
		res.redirect("/campgrounds/" + req.params.id);
	});
});

router.delete("/:id", middleware.isCampgroundOwner, function (req, res) {
	Campground.findByIdAndRemove(req.params.id, function (err) {
		res.redirect("/campgrounds");
	});
});


module.exports = router;