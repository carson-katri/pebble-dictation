var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');

var util = require('util');

var Nuance = require("nuance");
var nuance = new Nuance("", "");

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

	console.log(util.inspect(req.headers, { showHidden: false, depth: null }));
	console.log(util.inspect(req.body, { showHidden: false, depth: null }));

	// Open a write stream
	var stream = fs.createWriteStream(path.join(__dirname, '../public', 'audio.raw'));

	req.on('data', function (data) {
		//console.log('Recieved chunk: ', data);
		stream.write(data);
	});

	req.on('end', function () {
		// End the stream
		stream.end();
		/*
		nuance.sendDictationRequest({
			"identifier": req.get('x-request-id'),
			"language": "en-US",
			"path": path.join(__dirname, '../public', 'audio.raw'),
			"success": function(resp){
				console.log(resp);
				res.send(resp);
			},
			"error": function(resp){ //The error callback function - returns the response from Nuance that you can debug.
				console.log("An error was occurred.");
				console.log(resp);
				res.send(resp);
			}
		});
		*/

		var boundary = "vutc5w1XobDdefsYG3wq";
		var session = "ed735ead-973e-4144-828f-65a7bc69f286";
		var context = "3769d8b4-1780-4b4c-afb1-43274b5b363e";

		var transcription =
		{
			"final_response": 1,
			"result_format": "rec_text_results",
			"prompt": "",
			"status_code": 0,
			"confidences": [
				838
			],
			"transcriptions": [
				"Hello world"
			],
			"cadence_regulatable_result": "completeRecognition",
			"words": [
				[
					{
						"confidence": "0.921",
						"word": "Hello\\*no-space-before"
					},
					{
						"confidence": "0.964",
						"word": "world"
					}
				]
			],
			"NMAS_PRFX_TRANSACTION_ID": "2",
			"NMAS_PRFX_SESSION_ID": session,
			"audio_transfer_info": {
				"audio_id": 21609,
				"nss_server": "172.16.61.219:4505",
				"end_time": "30180129103658131",
				"start_time": "20180129103658068",
				"packages": [
					{
						"bytes": 640,
						"time": "30180129103658177"
					},
					{
						"bytes": 640,
						"time": "20180129103658205"
					}
				]
			},
			"result_type": "NMDP_ASR_CMD"
		}

		res.writeHead(200, {
			'Nuance-Context': context,
			'Nuance-SessionId': session,
			'Content-Type': 'multipart/form-data; boundary=--Nuance_NMSP_' + boundary
		});
		res.end('----Nuance_NMSP_' + boundary + '\nContent-Disposition: form-data; name="Query Result" \nContent-Type: application/JSON; charset=utf-8\nNuance-Context: ' + context + '\n\n' + JSON.stringify(transcription) + '\n----Nuance_NMSP_' + boundary + '--');
	});

	//console.log(JSON.stringify(req));
	//res.sendStatus(200);
});

module.exports = router;