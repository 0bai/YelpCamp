var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require("../public/javascripts/index");

/* GET campgrounds. */
router.get('/new', middleware.isLoggedIn, function (req, res, next) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground: foundCamp});
		}
	});
});

router.post('/', middleware.isLoggedIn, function (req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					req.flash("error", "Something Went Wrong!");
					console.log(err);
				} else {
					comment.author = {
						id: req.user._id,
						username: req.user.username
					};
					comment.save();
					console.log(comment);
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully Added A Comment");
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit", middleware.isCommentOwner, function (req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		if (err || !campground) {
			req.flash("error", "Campground can't be found!");
			res.redirect("back");
		} else {
			Comment.findById(req.params.comment_id, function (err, comment) {
				if (err) {
					res.redirect("back");
				} else {
					res.render("comments/edit", {comment: comment, campground_id: req.params.id});
				}
			});
		}
	});
});

router.put("/:comment_id", middleware.isCommentOwner, function (req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, comment) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", middleware.isCommentOwner, function (req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function (err) {
		if (err) {
			req.flash("error", "Something Went Wrong!");
			res.redirect("back");
		} else {
			req.flash("success", "Comment Deleted Successfully");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});



module.exports = router;