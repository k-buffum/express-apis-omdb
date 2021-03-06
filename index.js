var express = require("express");
var ejsLayouts = require("express-ejs-layouts");
var request = require("request");
var db = require("./models");
var bodyParser = require("body-parser");

var app = express();

app.set("view engine", "ejs");

app.use(ejsLayouts);
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use("/favorites", require("./controllers/favorites"));
app.use("/random", require("./controllers/random"));




app.get("/", function(req, res) {
	res.render("index.ejs");
});


//Returns results page with movie listings based on search
app.get("/results", function(req, res) {
	var qs = req.query.movieChoice;
	request( "http://omdbapi.com/?s=" + qs,
		function (error, response, body) {
			if(!error && response.statusCode == 200 ) {
				// console.log(response);
				movies = JSON.parse(body);
				console.log(movies);
				res.render("results.ejs", { movies: movies });
			} else if (response === 'False') {
				console.log(error)
				res.send(error)
				//res.redirect("/error");
			}
		}
	);
});


// Gets imdbID from each result based on search
app.get("/results/:imdbID", function(req, res) {
	var movieId = req.params.imdbID;
	request("http://omdbapi.com/?i=" + movieId,
		function (error, response, body) {
			if(!error && response.statusCode == 200) {
				movieInfo = JSON.parse(body);
				res.render("showMovie.ejs", {movieInfo: movieInfo});
			}
		}
	);
});

// Displays all tags ever made in data base
app.get("/tags", function(req, res) {
	db.tag.findAll().then(function(tags) {
		// res.send(tags);
		res.render("favorites/tags.ejs", {tags: tags});
		// console.log(tags[0].favoriteId);
	});
});


// Get all movies with related tag and display on a page
app.get("/tags/:favoriteId", function(req, res) {
	db.tag.find({
		where: {
			id: req.params.favoriteId
		},
		include: [db.omdbFavorite]
	}).then(function(tag) {
		res.render("moviesByTag.ejs", {tag: tag})
	})
});


app.get("/error", function(req, res) {
	res.render("error.ejs");
});

app.listen(3000);