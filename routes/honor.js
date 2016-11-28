var User = require("../models/user");

exports.getHonorPointsByUserId = function(req, res) {
	var userId = req.params.userId;
  	var promise = User.findById(userId);
  	promise.then(function (result){
      	res.json({ message: result.name, honorPoints: result.honour });
  	}).catch(function(err){
      	res.send(err);
    });
}