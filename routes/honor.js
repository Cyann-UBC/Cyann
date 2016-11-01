var User =   require("../models/user");

// exports.addHonorPointsByUserId = function(req, res) {
// 	var userId = req.params.userId;

//   	User.findById(userId, function(err,doc){
//     	if(err) res.json(err);

//     	doc.honor += 1
//     	doc.save(function(err){
//       	if(err) res.json(err)
//       	res.json({message:doc})
//     })
//   })
// }


exports.getHonorPointsByUserId = function(req, res) {
	var userId = req.params.userId;
  	var promise = User.findById(userId);
  	promise.then(function (result){
      	res.json({ message: result.name, honorPoints: result.honor });
  	}).catch(function(err){
      	res.send(err);
    });
}