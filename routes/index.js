var Course  =   require("../models/mongo");
module.exports = function(app){
    var handler = require('./handler');
    app.param('courseId', handler.handleCourseId);
    app.param('postId', handler.handlePostId);
    app.param('commentId', handler.handleCommenId);
    app.param('studentId', handler.handleId);

    var courses = require('./courses');
    app.get("/api/courses", courses.findAll);
    app.get("/api/courses/:courseName", courses.findByName)
    app.get("/api/courses/:courseId", courses.findById)
    app.post("/api/courses", courses.create);

    var posts = require('./posts');
    app.get("/api/courses/:courseId/posts", posts.findPostsByCourseId );
    app.get("/api/courses/:courseId/posts/:postId", posts.findPostsByCourseIdAndPostId );
    app.post("/api/courses/:courseId/posts", posts.createPostsByCourseId );
    app.put("/api/courses/:courseId/posts/:postId", posts.updatePostsById );
    app.delete("/api/courses/:courseId/posts/:postId", posts.deleteById );
    app.delete("/api/courses/:courseId/posts/", posts.deleteAll );

    var comments = require('./comments');
    app.post("/api/posts/:courseId/:postId/comments", comments.create);
    app.put("/api/posts/:courseId/:postId/comments/:commentId/upvote",comments.upvote);
    app.put("/api/posts/:courseId/:postId/comments/:commentId/downvote",comments.downvote);
    app.put("/api/posts/:courseId/:postId/comments/:commentId", comments.updateById);
    app.delete("/api/posts/:courseId/:postId/comments/:commentId", comments.deleteById);

    var studentLogin = require('./studentLogin');
    app.post("/api/students/login", studentLogin.login);
    app.post("/api/students/register",studentLogin.signUp);

    var studentInfo = require('./studentInfo');
    app.get("/api/students", studentInfo.findAll);
    app.get("/api/students/:studentId", studentInfo.findById)
    app.get("/api/students/:studentId/posts", studentInfo.findPostById)
    app.get("/api/students/:studentId/comments", studentInfo.findCommentById)

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
