var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
	res.send(process.env.MY_SEEKRIT_KEY);
});

router.get("/morestuff", function(req, res) {
	res.send("We have more stuff");
});

// Allows apps to talk to eachother
module.exports = router;