"use strict"
var multer  = require('multer');
var path = require('path')
var fs = require('fs');

//Upload the file and send back a response
exports.upload = function(req,res){
	 console.log(req.course.courseName)
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
	 var type = req.params.type
	 var courseName = req.course.courseName
	 var filename = req.file.originalname
	 var newFileDescription = {
		 [filename]:req.body.description
	 }

	 fs.writeFile(__dirname+'/..'+'/uploads/'+courseName+'/'+type+'/'+type+'.json',JSON.stringify(newFileDescription),'utf8', function (err) {
	  if (err) return console.log(err);
	  console.log(newFileDescription);
	});
	res.status(204).end();
};

//Get a list of files inside a specific course directory
exports.showFiles = function(req,res){
	var filePath = "/uploads/" + req.course.courseName + '/' + req.params.type
	var filesList = []
	console.log(req.course.courseName)
	console.log(__dirname + "/.." + filePath)
	fs.readdir(path.join(__dirname + "/.." + filePath), function(err, files) {
	    if (err) return;
			res.json({files:files})
	});
}

//Download a file in a specific course directory
exports.download = function(req,res){
	var type = req.params.type
	var filePath = "/uploads/" + req.course.courseName + "/" + type + "/"+ req.params.fileName
	//console.log(__dirname + "/.." + path)
	res.sendFile(path.join(__dirname + "/.." + filePath))
}

exports.deleteFile = function(req,res){
	var type = req.params.type
	var filePath = '/uploads/' + req.course.courseName + "/" + type + '/' +req.params.fileName
	//console.log(path.join(__dirname + "/.." + filePath))
	fs.unlink(path.join(__dirname + "/.." + filePath),function(){
		res.json({message:'deleted'})
	})
}

//Preserve the the original file namd when uploading
exports.storage = multer.diskStorage({
  destination: function (req, file, cb) {
		// console.log(req.params.courseId)
		var type = req.params.type
		var courseName = req.course.courseName
		var dest = 'uploads/'+ courseName +'/' + type
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    var originalname = file.originalname;
    var extension = originalname.split(".");
    var filename = originalname
		console.log('here')
    cb(null, filename);
  }
});
