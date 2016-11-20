var Courses = require("../models/course.js");
var Users = require('../models/user.js');
var nodemailer = require('nodemailer');

/*
  parameter: courseId
  usage: Retrieved all posts within a specific course given the courseId
*/
exports.findPostsByCourseId = function(req,res){
    Courses.findById({ '_id': req.params.courseId })
        .select("-__v")
        .populate("instructor", "name email profileImg userType", Users)
        .populate("posts.author", "name email profileImg userType", Users)
        .populate("posts.comments.author", "name email profileImg userType", Users)
        .then(function (result){
            res.json({ message: 'Retrieved All Posts!', data: result.posts });
        }).catch(function(err){
            res.send(err);
        });
};

/*
  parameter: courseId, postId
  usage: Retrieved a specific post within a specific course given the postId and courseId
*/
exports.findPostsByCourseIdAndPostId = function(req,res){
    res.json({message:"Post retrieved",data:req.post})
};

/*
  parameter: courseId, userId
  body: userId, title, content
  usage: Create a post within a specific course given the courseId
         Reference the created post inside the creator's "posts" field
*/
exports.createPostsByCourseId = function(req,res){

    // PARAMS
    var courseId = req.params.courseId;

    // BODY (x-www-form-urlencoded)
    var userId = req.body.userId;
    var newPost = {'title': req.body.title,
                   'content': req.body.content,
                   'author': userId,
                   'course': courseId};
    var newPostId = null;

    var emailList = [];
    //Create new post and get its postId
    var newPostObj = req.course.posts.create(newPost);
    req.course.posts.push(newPostObj);
    newPostId = newPostObj._id;
    //Save the course to DB
    req.course.save()
    .then(function(){
      //Find the user by userId
      return Users.findById(userId)
    })
    .then(function(user){
      if(user.userType === 'Instructor'){
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
                    console.log(error);
                res.end("error");
             }else{
                    console.log("Message sent: " + response.message);
                res.json({message:'posted created and email sent'});
                 }
              });
        })
      }
      else{
        res.json({message:"post created and user updated, no email sent", user:user})
      }
    })
    .catch(function(err){
      res.send(err)
    })
};

/*
  parameter: courseId, postId
  body: userId, title, content
  usage: update a post within a specific course given the postId and courseId
*/
exports.updatePostsByCourseId = function(req,res){
    //PARAMS
    var courseId = req.params.courseId
    var postId = req.params.postId;

    //BODY (x-www-form-urlencoded)
    var userId = req.body.userId;
    var newTitle = req.body.title;
    var newContent = req.body.content;

    var authorOfPost = req.post.author;

    var updatePost = {};
    if( newTitle )
        updatePost["title"] = newTitle;
    if( newContent )
        updatePost["content"] = newContent;

    if(authorOfPost._id == userId){
      var promise = Courses.update( {'_id': courseId,'posts._id': postId },
                                      { $set : {"posts.$.title":newTitle, "posts.$.content":newContent, "posts.$.updatedAt":new Date()} } );
      promise.then(function (result){
          //send newTitle and newContent back for rendering purpose
          res.json({ message: 'Updated post #'+postId+'!', data: {title:newTitle, conent:newContent} });
        //  var promise = Users.update({'_id':req.params.userId, ''})
      }).catch(function(err){
          res.send(err);
      });
    }else{
      res.json({message:'You do not have permissions to edit the POST'})
    }

};

/*
  parameter: courseId, postId, userId
  usage: delete a post within a specific course given the postId and courseId
         unreference the post from its creator(user)
*/
exports.deleteByCourseId = function(req,res){
  //PARAMS
  var courseId = req.params.courseId
  var postId = req.params.postId;

  //BODY (x-www-form-urlencoded)
  var userId = req.body.userId;

  var userType = null;
  var authorOfPost = req.post.author;

  if(authorOfPost == userId ){
    req.post.remove()
    .then(function(){
      return req.course.save()
    })
    .then(function(){
      return Users.findById(userId)
    })
    .then(function(user){
      user.update({$pull: {'posts':postId}});
    })
    .then(function(result){
      res.json({message:"Post deleted and user updated",data:result});
    })
    .catch(function(err){
      res.send(err);
    })
  }
  else{
    res.json({message:"You do not have permissions to edit the POST"})
  }
}

/*
  parameter: courseId, postId
  usage: delete a post within a specific course given the postId and courseId
*/
exports.deleteAll = function(req,res){
  var promise = Courses.update({courseName:req.course.courseName}, { $set: { posts: [] }})
  promise.then(function(result){
    res.json({data:result})
  }).catch(function(err){
    res.send(err)
  })
};
