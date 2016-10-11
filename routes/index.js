var Course  =   require("../models/mongo");
module.exports = function(app){
    var handler = require('./handler');
    app.param('courseId', handler.handleCourseId);
    app.param('postId', handler.handlePostId);
    app.param('commentId', handler.handleCommenId);
    app.param('userId', handler.handleId);

    var courses = require('./courses');
    app.get("/api/courses", courses.findAll);
    app.get("/api/courses/:courseId", courses.findById)
    app.post("/api/courses", courses.create);

    /* todos:
          userId needs to be x-www-form-urlencoded
          check for permission before updating and deleting a post
    */
    var posts = require('./posts');
    app.get("/api/courses/:courseId/posts", posts.findPostsByCourseId );
    app.get("/api/courses/:courseId/posts/:postId", posts.findPostsByCourseIdAndPostId );
    app.post("/api/courses/:courseId/users/:userId/posts", posts.createPostsByCourseIdAndUserId );
    app.put("/api/courses/:courseId/posts/:postId", posts.updatePostsByCourseId );
    app.delete("/api/courses/:courseId/users/:userId/posts/:postId", posts.deleteByCourseIdAndUserId );
    app.delete("/api/courses/:courseId/posts", posts.deleteAll );

    var comments = require('./comments');
    app.get("/api/courses/:courseId/posts/:postId/comments", comments.findAll);
    app.get("/api/courses/:courseId/posts/:postId/comments/:commentsId", comments.findById);
    app.post("/api/courses/:courseId/posts/:postId/comments", comments.create);
    // app.put("/api/courses/:courseId/posts/:postId/comments/:commentId/upvote",comments.upvote);
    // app.put("/api/courses/:courseId/posts/:postId/comments/:commentId/downvote",comments.downvote);
    // app.put("/api/courses/:courseId/posts/:postId/comments/:commentId", comments.updateById);
    // app.delete("/api/courses/:courseId/posts/:postId/comments/:commentId", comments.deleteById);

    var userLogin = require('./userLogin');
    app.post("/api/users/login", userLogin.login);
    app.post("/api/users/register",userLogin.signUp);

    var userInfo = require('./userInfo');
    app.get("/api/users", userInfo.findAll);
    app.get("/api/users/:userId", userInfo.findById)
    app.get("/api/users/:userId/posts", userInfo.findPostById)
    app.get("/api/users/:userId/comments", userInfo.findCommentById)

    //Save global file to file system
    //Uses multer
    //Might be deprecated in the future
    var fileUpload = require("./fileUpload");
    var multer  = require('multer');
    var upload = multer({storage: fileUpload.storage, dest: './uploads'});
    var type = upload.single('attachment');
    app.post("/api/:courseId/files/upload",type, fileUpload.upload);
    app.get("/api/:courseId/files/download/:fileName", fileUpload.download);
    app.get("/api/:courseId/files/", fileUpload.showFiles)

    //Save file for individual as attachment
    //Uses formidable, gridfs, fs
}
