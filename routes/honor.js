var User = require("../models/user");

exports.getHonorPointsByUserId = function(req, res) {
	if( req.user.userType == "instructor" ) {
        var err = new Error();
        err.message = 'Access denied!';
        err.status = 400;
        res.status(400);
        res.json(err);
        return;
    }
    
	var userId = req.params.userId;
  var promise = User.findById(userId);
	promise.then(function (result){
     	res.json({ userName: result.name, honorPoints: result.honor });
 	}).catch(function(err){
     	res.send(err);
  });
}