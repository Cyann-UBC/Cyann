var Courses = require("../models/course.js");
var Users = require('../models/user.js')
/*
  parameter: courseId
  usage: Retrieved all posts within a specific course given the courseId
*/
exports.findPostsByCourseId = function(req,res){
    Courses.findById({ '_id': req.params.courseId })
        .select("-__v")
        .populate("instructor", "name", Users)
        .populate("posts.author", "name", Users)
        .populate("posts.comments.author", "name", Users)
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
    var newPost = { "title": req.body.title,
                    "content": req.body.content,
                    "author": req.body.author,
                    "course": req.params.courseId };
    var newPostObj = null;

    Courses.findById({ "_id": req.params.courseId })
        .then(function(thisCourse){
            // Create new post and get its postId
            newPostObj = thisCourse.posts.create(newPost);
            thisCourse.posts.push(newPostObj);
            return thisCourse.save();
        })
        .then(function(thisCourse){
            res.json({ message: "Retrieved all courses!", data: newPostObj });
        })
        .catch(function(err){
            res.send(err);
        });
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

    if(authorOfPost == userId){
      var promise = Courses.update( {'_id': courseId,'posts._id': postId },
                                      { $set : {"posts.$.title":newTitle, "posts.$.content":newContent, "posts.$.updatedAt":new Date()} } );
      promise.then(function (result){
          res.json({ message: 'Updated post #'+postId+'!', data: result });
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
