const MobileController = require('../controllers/MobileController');

module.exports = function(app){

	const mobileController = new MobileController(app.datasource.models.Mobile);

	// Criar novo bilhete
	app.post('/usuarios/:user_id/mobiles', function(req, res, next){
		let userID = req.params.user_id;

		req.body.id_usuario = userID;

		mobileController.create(req.body)
			.then(function(response){
				res.json(response);
			});
	});
}