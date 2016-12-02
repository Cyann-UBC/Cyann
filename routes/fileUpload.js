"use strict"
var multer  = require('multer');
var path = require('path')
var fs = require('fs');
var Courses = require("../models/course.js");
var nodemailer = require('nodemailer');

//Upload the file and send back a response
exports.upload = function(req,res){
	if( req.user.userType != "instructor" ) {
        var err = new Error();
        err.message = 'Access denied!';
        err.status = 400;
        res.status(400);
        res.json(err);
        return;
    }else if(req.user.userType === "instructor"){
			Courses.findById(req.params.courseId)
			.populate({ path: 'users', model: Users })
			.then(function(course){
				for(var i = 0; i< course.users.length; i++){
					emailList = emailList.concat(course.users[0].email)
				}
			})
			.then(function(){
			var smtpTransport = nodemailer.createTransport("SMTP",{
					service: "hotmail",
					auth: {
							user: "howard12345678987654321@hotmail.com", //this needs to be changed
							pass: '***!'
					}
			});
			var mailOptions={
							to : emailList,
							subject : req.body.title,
							text : req.body.content
					}
					smtpTransport.sendMail(mailOptions, function(error, response){
					 if(error){
							  res.json({message:'post created but there is no user to email'});
					 }else{
							res.json({message:'posted created and email sent'});
							 }
						});
			})

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
	res.json({message:'file uploaded'});

	}
}
//Get a list of files inside a specific course directory
exports.showFiles = function(req,res){

	var filePath = "/uploads/" + req.course.courseName + '/' + req.params.type
	var filesList = []
//	console.log(req.course.courseName)
//	console.log(__dirname + "/.." + filePath)
	fs.readdir(path.join(__dirname + "/.." + filePath), function(err, files) {
	    if (err) return;
			res.json({files:files})
	});
}

//Download a file in a specific course directory
exports.download = function(req,res){
	var fileName = req.query.fileName
	var type = req.params.type
	var filePath = "/uploads/" + req.course.courseName + "/" + type + "/"+ fileName
	//console.log(__dirname + "/.." + path)
	res.sendFile(path.join(__dirname + "/.." + filePath))
}

exports.deleteFile = function(req,res){
	var fileName = req.query.fileName
	if( req.user.userType != "instructor" ) {
        var err = new Error();
        err.message = 'Access denied!';
        err.status = 400;
        res.status(400);
        res.json(err);
        return;
    }

	var type = req.params.type
	var filePath = '/uploads/' + req.course.courseName + "/" + type + '/' +fileName
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
