var Courses = require("../models/course.js");
var Users = require('../models/user.js')

module.exports = function(app){
    //---------------------------------------
    // MIDDLEWARE
    //---------------------------------------
    var handler = require('./handler');
    app.param('courseId', handler.handleCourseId);
    app.param('postId', handler.handlePostId);
    app.param('commentId', handler.handleCommentId);
    app.param('userId', handler.handleUserId);
    
    //---------------------------------------
    // HONOR SYSTEM ROUTES
    //---------------------------------------
    var honor = require('./honor');
    app.get("/api/honor/:userId", honor.getHonorPointsByUserId);
    //app.put("/api/honor/:userId", honor.addHonorPointsByUserId);
    
    //---------------------------------------
    // COURSES ROUTES
    //---------------------------------------
    var courses = require('./courses');
    app.get("/api/courses", courses.findAll);
    //app.get("/api/courses/:courseName", courses.findByName)
    app.get("/api/courses/:courseId", courses.findById);
    app.post("/api/courses", courses.create);
    app.put("/api/courses/:courseId", courses.updateById);

    //---------------------------------------
    // POSTS ROUTES
    //---------------------------------------
    var posts = require('./posts');
    app.get("/api/courses/:courseId/posts", posts.findPostsByCourseId );
    app.get("/api/courses/:courseId/posts/:postId", posts.findPostsByCourseIdAndPostId );
    app.post("/api/courses/:courseId/posts", posts.createPostsByCourseId );
    app.put("/api/courses/:courseId/posts/:postId", posts.updatePostsByCourseId );
    app.delete("/api/courses/:courseId/posts/:postId", posts.deleteByCourseId );
    app.delete("/api/courses/:courseId/posts", posts.deleteAll );

    //---------------------------------------
    // COMMENTS ROUTES
    //---------------------------------------
    var comments = require('./comments');
    app.get("/api/courses/:courseId/posts/:postId/comments", comments.findAll);
    app.get("/api/courses/:courseId/posts/:postId/comments/:commentId", comments.findById);
    app.post("/api/courses/:courseId/posts/:postId/comments", comments.create);
    app.put("/api/courses/:courseId/posts/:postId/comments/:commentId", comments.updateById);
    app.delete("/api/courses/:courseId/posts/:postId/comments/:commentId", comments.deleteById);
    app.put("/api/courses/:courseId/posts/:postId/comments/:commentId/setAsAnswer",comments.setAsAnswer);
    app.put("/api/courses/:courseId/posts/:postId/comments/:commentId/unsetAsAnswer",comments.unsetAsAnswer);
    app.put("/api/courses/:courseId/posts/:postId/comments/:commentId/upvote",comments.upvote);
    // app.put("/api/courses/:courseId/posts/:postId/comments/:commentId/downvote",comments.downvote);
    app.put("/api/courses/:courseId/posts/:postId/comments/:commentId/resetVote",comments.resetVote);

    //---------------------------------------
    // USER AUTHENTICATION ROUTES
    //---------------------------------------
    var userLogin = require('./userLogin');
    app.post("/api/users/login", userLogin.login);
    app.post("/api/users/register",userLogin.signUp);

    //---------------------------------------
    // USER INFO ROUTES
    //---------------------------------------
    var userInfo = require('./userInfo');
    app.get("/api/users", userInfo.findAll);
    app.get("/api/users/:userId", userInfo.findById)
    app.get("/api/users/:userId/posts", userInfo.findPostById)
    app.get("/api/users/:userId/comments", userInfo.findCommentById)

    // //---------------------------------------
    // // FILE UPLOAD ROUTES
    // //---------------------------------------
    // //Save global file to file system
    // //Uses multer
    // //Might be deprecated in the future
    // var fileUpload = require("./fileUpload");
    // var multer  = require('multer');
    // var upload = multer({storage: fileUpload.storage, dest: './uploads'});
    // var type = upload.single('attachment');
    // app.post("/api/:courseId/files/upload",type, fileUpload.upload);
    // app.get("/api/:courseId/files/download/:fileName", fileUpload.download);
    // app.get("/api/:courseId/files/", fileUpload.showFiles)
    // //Save file for individual as attachment
    // //Uses formidable, gridfs, fs
}
