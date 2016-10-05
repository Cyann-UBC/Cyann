var forumPosts  =   require("../models/mongo");

// CREATE COMMENT BY POST-ID
exports.create = function(req,res){
    var postId = req.params.postId;
    var newComment = { 'content': req.body.content }

    var promise = forumPosts.findByIdAndUpdate( postId,
        {$push: {comments: newComment}},
        {safe: true, upsert: true}
    );
    promise.then(function (result){
      console.log(result)
        res.json({ message: 'Added comment to post #'+postId+'!', data: result });
    }).catch(function(err){
        res.send(err);
    });
};
// UPDATE COMMENT BY POST-ID + COMMENT-ID
exports.updateById = function(req,res){
    var postId = req.params.postId;
    var commentId = req.params.commentId;
    var updatedCommentContent = req.body.content;
    var newDate = new Date()
    var promise = forumPosts.update({ '_id': postId, "comments._id": commentId },
                                    { $set : { "comments.$.content": updatedCommentContent , "comments.$.updated":newDate} } );

    promise.then(function (result){
        res.json({ message: 'Updated comment #'+commentId+' of post #'+postId+'!', data: result });
    }).catch(function(err){
        res.send(err);
    });
};
// DELETE COMMENT BY POST-ID + COMMENT-ID
exports.deleteById = function(req,res){
    var postId = req.params.postId;
    var commentId = req.params.commentId;

    var promise = forumPosts.update({ '_id': postId, "comments._id":commentId },
                                    { $pull : { "comments": { '_id': commentId } } } );
    promise.then(function (result){
        res.json({ message: 'Removed comment #'+commentId+' of post #'+postId+'!', data: result });
    }).catch(function(err){
        res.send(err);
    });
};

// exports.upvote = function(req,res){
//   var postId = req.params.postId;
//   var commentId = req.params.commentId;
//   // var promise = forumPosts.findByIdAndUpdate({'_id':postId, "comments._id":commentId},
//   //                                 {$inc : {"comments.$.votes":1}})
//   //
//   promise.then(function(result){
//     res.json({ message: result})
//   }).catch(function(err){
//     res.send(err);
//   });
// };

exports.upvote = function(req,res){
  var postId = req.params.postId;
  var commentId = req.params.commentId;

  forumPosts.findById(postId, function(err,doc){
    if(err) res.json(err);

    doc.comments.id(commentId).upvotes += 1
    doc.save(function(err){
      if(err) res.json(err)
      res.json({message:doc})
    })
  })
};

exports.downvote = function(req,res){
  var postId = req.params.postId;
  var commentId = req.params.commentId;

  forumPosts.findById(postId, function(err,doc){
    if(err) res.json(err);

    doc.comments.id(commentId).downvotes += 1
    doc.save(function(err){
      if(err) res.json(err)
      res.json({message:doc})
    })
  })
};
