var express = require('express');
var router = express.Router();

var path = require('path');

var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/boot', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public', 'boot.json'));
});

/* PROXY */
router.post('/NmspServlet', function(req, res, next) {
	/*
	nuance.sendDictationRequest({
	    "identifier": "randomIdentifierStringHere",
	    "language": "en-US",
	    "path": "audio.wav",
	    "additionalHeaders": {}, //If you'd like to supply more headers or replace the default headers, supply them here. 
	    "success": function(resp){ //The success callback function. 
	        console.log(resp);
	    },
	    "error": function(resp){ //The error callback function - returns the response from Nuance that you can debug. 
	        console.log("An error was occurred.");
	        console.log(resp);
	    }
	});
	*/

	console.log(util.inspect(req, { showHidden: false, depth: null }));

	//console.log(JSON.stringify(req));
	res.sendStatus(200);
});

module.exports = router;