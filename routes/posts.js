var Course  =   require("../models/mongo");

/*
  parameter: courseId
  usage: Retrieved all posts within a specific course given the courseId
*/
exports.findPostsByCourseId = function(req,res){
    res.json({message:"Retrieved posts for course:"+req.course.courseName, data:req.course.posts})
};

/*
  parameter: courseId, postId
  usage: Retrieved a specific post within a specific course given the postId and courseId
*/
exports.findPostsByCourseIdAndPostId = function(req,res){
    res.json({message:"Post retrieved",data:req.post})
};

/*
  parameter: courseId
  usage: Create a post within a specific course given the courseId
*/
exports.createPostsByCourseId = function(req,res){
    req.course.posts.push(req.body)
    var promise = req.course.save();
    promise.then(function(result){
      res.json({message:"Post created in course"+req.course.courseName, data:result})
    }).catch(function(err){
      res.send(err)
    })
};

/*
  parameter: courseId, postId
  usage: update a post within a specific course given the postId and courseId
*/
exports.updatePostsById = function(req,res){
    var courseId = req.params.courseId
    var postId = req.params.postId;
    var newTitle = req.body.title;
    var newContent = req.body.content;

    var updatePost = {};
    if( newTitle )
        updatePost["title"] = newTitle;
    if( newContent )
        updatePost["content"] = newContent;
        console.log(req.course.posts)
    var promise = Course.update( {'_id': courseId,'posts._id': postId },
                                    { $set : {"posts.$.title":newTitle, "posts.$.content":newContent} } );
    promise.then(function (result){
        res.json({ message: 'Updated post #'+postId+'!', data: result });
    }).catch(function(err){
        res.send(err);
    });
};

/*
  parameter: courseId, postId
  usage: delete a post within a specific course given the postId and courseId
*/
exports.deleteById = function(req,res){
  var promise = req.post.remove()
  promise.then(function(){
    var promise = req.course.save()
    promise.then(function(result){
      res.json({message:"post deleted", data:result})
    }).catch(function(err){
      res.send(err)
    })
  }).catch(function(err){
    res.send(err)
  })
}

/*
  parameter: courseId, postId
  usage: delete a post within a specific course given the postId and courseId
*/
exports.deleteAll = function(req,res){
  var promise = Course.update({courseName:req.course.courseName}, { $set: { posts: [] }})
  promise.then(function(result){
    res.json({data:result})
  }).catch(function(err){
    res.send(err)
  })
};
