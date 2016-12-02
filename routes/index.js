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

    //---------------------------------------
    // COURSES ROUTES
    //---------------------------------------
    var courses = require('./courses');
    app.get("/api/courses", courses.findAll);
    app.get("/api/courses/users/:courseId", courses.findAllUsers);
    app.put("/api/courses/addUser/:courseId", courses.addUser);
    app.put("/api/courses/removeUser/:courseId", courses.removeUser);
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
    app.put("/api/courses/:courseId/posts/:postId/comments/:commentId/resetVote",comments.resetVote);

    //---------------------------------------
    // USER AUTHENTICATION ROUTES
    //---------------------------------------
    var userLogin = require('./userLogin');
    //app.post("/api/users/login", userLogin.login);
    app.post("/api/users/register", userLogin.register);

    //---------------------------------------
    // USER INFO ROUTES
    //---------------------------------------
    var userInfo = require('./userInfo');
    app.get("/api/users/my", userInfo.findById)
    app.get("/api/users/my/posts", userInfo.findPostById)
    app.get("/api/users/my/comments", userInfo.findCommentById)
    app.get("/api/users/my/courseData", userInfo.getCourseData)

    //---------------------------------------
    // SEARCH ROUTES
    //---------------------------------------
    var search = require('./search.js');
    app.get("/api/courses/:courseId/search", search.searchPosts );

    // //---------------------------------------
    // // FILE UPLOAD ROUTES
    // //---------------------------------------
    //Save global file to file system
    //Uses multer
    var fileUpload = require("./fileUpload");
    var multer  = require('multer');
    var upload = multer({storage: fileUpload.storage, dest: './uploads'});
    var type = upload.single('attachment');
    app.post("/api/:courseId/files/:type/upload",type, fileUpload.upload);
    app.get("/api/:courseId/files/:type/download/:fileName", fileUpload.download);
    app.get("/api/:courseId/files/:type", fileUpload.showFiles);
    app.delete("/api/:courseId/files/:type/:fileName",fileUpload.deleteFile);
    // //Save file for individual as attachment
    // //Uses formidable, gridfs, fs
}
