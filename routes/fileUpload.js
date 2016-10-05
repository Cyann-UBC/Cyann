"use strict"
var multer  = require('multer');
var path = require('path')
var fs = require('fs');


//Upload the file and send back a response
exports.upload = function(req,res){
	 console.log(req.params.courseId)
	 console.log(req.file.mimetype); //form files
	/* example output:
            { fieldname: 'upl',
              originalname: 'grumpy.png',
              encoding: '7bit',
              mimetype: 'image/png',
              destination: './uploads/',
              filename: '436ec561793aa4dc475a88e84776b1b9',
              path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
              size: 277056 }
	 */
	res.status(204).end();
};

//Get a list of files inside a specific course directory
exports.showFiles = function(req,res){
	var filePath = "/uploads/" + req.params.courseId
	var filesList = []
	console.log(__dirname + "/.." + filePath)
	fs.readdir(path.join(__dirname + "/.." + filePath), function(err, files) {
	    if (err) return;
			res.json({files:files})
	});
}

//Download a file in a specific course directory
exports.download = function(req,res){
	var filePath = "/uploads/" + req.params.courseId + "/" + req.params.fileName
	//console.log(__dirname + "/.." + path)
	res.sendFile(path.join(__dirname + "/.." + filePath))
}


//Preserve the the original file namd when uploading
exports.storage = multer.diskStorage({
  destination: function (req, file, cb) {
		console.log(req.params.courseId)
		var dest = 'uploads/'+req.params.courseId
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    var originalname = file.originalname;
    var extension = originalname.split(".");
    var filename = originalname
    cb(null, filename);
  }
});
